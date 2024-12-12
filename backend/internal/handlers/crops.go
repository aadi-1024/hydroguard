package handlers

import (
	"bytes"
	"encoding/json"
	"fmt"
	"hydroguard/internal/database"
	"hydroguard/internal/models"
	"io"
	"log"
	"math/rand/v2"
	"net/http"
	"strconv"
	"time"

	"github.com/bradfitz/gomemcache/memcache"
	"github.com/labstack/echo/v4"
)

// Function to read C value from c-values.csv
// func getCValue(soilType string) (float64, error) {
// 	file, err := os.Open("./c-value.csv")
// 	if err != nil {
// 		return 0, fmt.Errorf("failed to open c-values.csv: %v", err)
// 	}
// 	defer file.Close()

// 	reader := csv.NewReader(file)
// 	rows, err := reader.ReadAll()
// 	if err != nil {
// 		return 0, fmt.Errorf("failed to read c-values.csv: %v", err)
// 	}

// 	for _, row := range rows {
// 		if row[0] == soilType {
// 			return strconv.ParseFloat(row[1], 64)
// 		}
// 	}

// 	return 0, fmt.Errorf("soil type %s not found in c-values.csv", soilType)
// }

// // Function to calculate losses based on canal type
// func calculateCanalLosses(totalLoss float64, canalType string) float64 {
// 	maxFlow := 1.515 * totalLoss
// 	var losses float64

// 	switch canalType {
// 	case "unlined":
// 		losses = 0.66 * maxFlow
// 	case "lined":
// 		losses = 0.35 * maxFlow
// 	case "piped":
// 		losses = 0.1 * maxFlow
// 	default:
// 		fmt.Println("Invalid canal type")
// 		return 0
// 	}

// 	return losses
// }

func InitiateRequest(db database.Database, cache database.Cache) echo.HandlerFunc {
	return func(c echo.Context) error {
		res := &models.Response{}

		type req struct {
			DamId int `json:"dam_id"`
		}

		reqPayload := req{}

		if err := c.Bind(&reqPayload); err != nil {
			res.Message = err.Error()
			return c.JSON(http.StatusBadRequest, res)
		}

		cmdCoords, err := db.GetCommandCoordinatesByDamId(c.Request().Context(), reqPayload.DamId)
		if err != nil {
			res.Message = err.Error()
			return c.JSON(http.StatusInternalServerError, res)
		}

		reqPay := map[string]any{
			"coordinates": cmdCoords,
		}

		jsonPayload, _ := json.Marshal(&reqPay)

		body := bytes.NewReader(jsonPayload)

		client := http.Client{}
		client.Timeout = 0

		resp, err := client.Post("http://localhost:5000/area", "application/json", body)
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

		data := map[string]any{
			"area": area,
			"id":   reqPayload.DamId,
		}

		dataB, err := json.Marshal(&data)
		if err != nil {
			res.Message = err.Error()
			return c.JSON(http.StatusInternalServerError, res)
		}

		//replace with userid later
		cache.Conn.Add(&memcache.Item{
			Key:        strconv.Itoa(num),
			Value:      dataB,
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
			// SoilType      string  `json:"soil_type"`
			// CanalArea     float64 `json:"canal_area"`      //mill sq. feet
			// Depth         float64 `json:"depth"`           //feet
			// Qe            float64 `json:"qe"`              //length of discharge per unit length
			// LengthOfCanal float64 `json:"length_of_canal"` //metres
			// CanalType     string  `json:"canal_type"`
		}

		reqPayload := req{}
		if err := c.Bind(&reqPayload); err != nil {
			res.Message = err.Error()
			return c.JSON(http.StatusBadRequest, res)
		}

		log.Println(reqPayload)

		item, err := cache.Conn.Get(reqPayload.Token)
		if err != nil {
			res.Message = err.Error()
			return c.JSON(http.StatusBadRequest, res)
		}

		dat := make(map[string]any)
		json.Unmarshal(item.Value, &dat)
		area := dat["area"].(float64)

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
				//assuming drip has an efficiency of 90%
				msg += fmt.Sprintf("Can switch %v to drip. ", k)
				optimalWaterUsage += v * 1.11
			} else if cropWaterReq[k].Sprinkler {
				//assuming sprinkler has an efficiency of 75%
				msg += fmt.Sprintf("Can switch %v to sprinkler. ", k)
				optimalWaterUsage += v * 1.33
			} else {
				msg += "Unfortunately already at best efficiency. "
				optimalWaterUsage += v * 2
			}
		}

		//calculating water savings in given configuration
		msg2 := ""
		waterGivenConfig := float64(0)
		for _, v := range reqPayload.Crops {
			if v.IrrigationType == "drip" {
				if cropWaterReq[v.CropType].Drip {
					waterGivenConfig += float64(v.LandCover) * area * cropWaterReq[v.CropType].TotalEtc * 1.11 / 1000
				} else {
					msg2 += fmt.Sprintf("Can't switch %v to drip", v.CropType)
				}
			} else if v.IrrigationType == "sprinkler" {
				if cropWaterReq[v.CropType].Sprinkler {
					waterGivenConfig += float64(v.LandCover) * area * cropWaterReq[v.CropType].TotalEtc * 1.33 / 1000
				} else {
					msg2 += fmt.Sprintf("Can't switch %v to drip", v.CropType)
				}
			} else {
				waterGivenConfig += float64(v.LandCover) * area * cropWaterReq[v.CropType].TotalEtc * 2 / 1000
			}
		}

		// Seepage and evaporation calculations
		// cValue, err := getCValue(reqPayload.SoilType)
		// if err != nil {
		// 	res.Message = fmt.Sprintf("Error calculating seepage: %v", err)
		// 	return c.JSON(http.StatusInternalServerError, res)
		// }
		// seepageLosses := cValue * reqPayload.CanalArea * reqPayload.Depth * 35.31
		// evaporationDischarge := reqPayload.Qe * reqPayload.LengthOfCanal

		// // Canal loss calculations
		// canalLosses := calculateCanalLosses(evaporationDischarge+seepageLosses, reqPayload.CanalType)

		data := models.CropAnalysis{
			DamId:                int(dat["id"].(float64)),
			CreatedAt:            time.Now(),
			CropWaterRequirement: waterReq,
			// SeepageLosses:        seepageLosses,
			// EvaporationDischarge: evaporationDischarge,
			// CanalLosses:          canalLosses,
			OptimalWaterUsage: optimalWaterUsage,
			WaterGivenConfig:  waterGivenConfig,
			Suggestions:       msg,
			ConfigErrors:      msg2,
		}

		data, err = db.CreateCropAnalysis(c.Request().Context(), data)
		if err != nil {
			res.Message = err.Error()
			return c.JSON(http.StatusInternalServerError, res)
		}

		res.Message = "successful"
		res.Data = data
		return c.JSON(http.StatusOK, res)
	}
}

func InitiateRequestOld(db database.Database, cache database.Cache) echo.HandlerFunc {
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

func ProcessRequestOld(db database.Database, cache database.Cache) echo.HandlerFunc {
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
