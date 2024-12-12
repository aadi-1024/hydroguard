package handlers

import (
	"bytes"
	"encoding/json"
	"fmt"
	"hydroguard/internal/database"
	"hydroguard/internal/models"
	"io"
	"math/rand/v2"
	"net/http"
	"strconv"

	"github.com/bradfitz/gomemcache/memcache"
	"github.com/labstack/echo/v4"
)

func InitiateRequest(db database.Database, cache database.Cache) echo.HandlerFunc {
	return func(c echo.Context) error {
		res := &models.Response{}

		type coordinate struct {
			Latitude  float64 `json:"latitude"`
			Longitude float64 `json:"longitude"`
		}

		type req struct {
			Coordinates []coordinate `json:"coordinates"`
		}

		reqPayload := req{}

		if err := c.Bind(&reqPayload); err != nil {
			res.Message = err.Error()
			return c.JSON(http.StatusBadRequest, res)
		}

		jsonPayload, _ := json.Marshal(&reqPayload)

		body := bytes.NewReader(jsonPayload)

		resp, err := http.Post("http://localhost:5000/area", "application/json", body)
		if err != nil {
			res.Message = err.Error()
			return c.JSON(http.StatusInternalServerError, res)
		}

		retBody, err := io.ReadAll(resp.Body)
		if err != nil {
			res.Message = err.Error()
			return c.JSON(http.StatusInternalServerError, res)
		}

		area, _ := strconv.ParseFloat(string(retBody), 64)
		num := rand.IntN(899) + 100

		//replace with userid later
		cache.Conn.Add(&memcache.Item{
			Key:        strconv.Itoa(num),
			Value:      []byte(strconv.FormatFloat(area, 'f', 6, 64)),
			Expiration: 1800,
		})

		final := map[string]any{
			"area":    area,
			"token":   strconv.Itoa(num),
			"weather": "filllater",
		}

		res.Message = "successful"
		res.Data = final
		return c.JSON(http.StatusOK, res)
	}
}

func ProcessRequest(db database.Database, cache database.Cache) echo.HandlerFunc {
	return func(c echo.Context) error {
		res := &models.Response{}

		cropWaterReq := make(map[string]models.Crop)
		cropData, err := db.GetAllCropPatterns(c.Request().Context())
		if err != nil {
			res.Message = err.Error()
			return c.JSON(http.StatusInternalServerError, res)
		}
		for _, v := range cropData {
			cropWaterReq[v.Name] = v
		}

		type crop struct {
			CropType       string `json:"crop_type"`
			IrrigationType string `json:"irrigation_type"`
			//current if it is the method being used rn
			//future if the change is to be tested
			// Use       string  `json:"use"`
			LandCover float32 `json:"land_cover"`
		}

		type req struct {
			Token string  `json:"token"`
			Rain  float32 `json:"rain"`
			Crops []crop  `json:"crops"`
		}

		reqPayload := req{}
		if err := c.Bind(&reqPayload); err != nil {
			res.Message = err.Error()
			return c.JSON(http.StatusBadRequest, res)
		}

		item, err := cache.Conn.Get(reqPayload.Token)
		if err != nil {
			res.Message = err.Error()
			return c.JSON(http.StatusBadRequest, res)
		}
		area, _ := strconv.ParseFloat(string(item.Value), 64)

		cropShare := make(map[string]float64)
		for _, v := range reqPayload.Crops {
			cropShare[v.CropType] += float64(v.LandCover)
		}

		efficientWaterContrib := make(map[string]float64)
		waterReq := float64(0)
		for k, v := range cropShare {
			waterReq += (cropWaterReq[k].TotalEtc / 1000) * area * v //m^3
			efficientWaterContrib[k] += (cropWaterReq[k].TotalEtc / 1000) * area * v
		}

		optimalWaterUsage := float64(0)
		msg := ""
		for k, v := range efficientWaterContrib {
			if cropWaterReq[k].Drip {
				//assuming drip has an efficiency of 70%
				msg += fmt.Sprintf("Can switch %v to drip. ", k)
				optimalWaterUsage += v * 1.42
			} else if cropWaterReq[k].Sprinkler {
				//assuming sprinkler has an efficiency of 50%
				msg += fmt.Sprintf("Can switch %v to sprinkler. ", k)
				optimalWaterUsage += v * 2
			} else {
				msg += "Unfortunately already at best efficiency. "
				optimalWaterUsage += v * 3.34
			}
		}

		//calculating water savings in given configuration
		msg2 := ""
		waterGivenConfig := float64(0)
		for _, v := range reqPayload.Crops {
			if v.IrrigationType == "drip" {
				if cropWaterReq[v.CropType].Drip {
					waterGivenConfig += float64(v.LandCover) * area * cropWaterReq[v.CropType].TotalEtc * 1.42
				} else {
					msg2 += fmt.Sprintf("Can't switch %v to drip", v.CropType)
				}
			} else if v.IrrigationType == "sprinkler" {
				if cropWaterReq[v.CropType].Sprinkler {
					waterGivenConfig += float64(v.LandCover) * area * cropWaterReq[v.CropType].TotalEtc * 2
				} else {
					msg2 += fmt.Sprintf("Can't switch %v to drip", v.CropType)
				}
			} else {
				waterGivenConfig += float64(v.LandCover) * area * cropWaterReq[v.CropType].TotalEtc * 3.34
			}
		}

		type jsonRes struct {
			CropWaterRequirement float64 `json:"crop_water_requirement"`
			WaterGivenConfig     float64 `json:"water_given_config"`
			OptimalWaterUsage    float64 `json:"optimal_water_usage"`
			Suggestions          string  `json:"suggestions"`
			ConfigErrors         string  `json:"config_errors"`
		}

		data := jsonRes{
			waterReq,
			waterGivenConfig,
			optimalWaterUsage,
			msg,
			msg2,
		}

		res.Message = "successful"
		res.Data = data
		return c.JSON(http.StatusOK, res)
	}
}
