package handlers
package main

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

	"github.com/bradfitz/gomemcache/memcache"
	"github.com/labstack/echo/v4"
	"encoding/csv"
	"fmt"
	"os"
	"strconv"

)

// Function to read C value from c-values.csv
func getCValue(soilType string) (float64, error) {
	file, err := os.Open("../c-values.csv")
	if err != nil {
		return 0, fmt.Errorf("failed to open c-values.csv: %v", err)
	}
	defer file.Close()

	reader := csv.NewReader(file)
	rows, err := reader.ReadAll()
	if err != nil {
		return 0, fmt.Errorf("failed to read c-values.csv: %v", err)
	}

	for _, row := range rows {
		if row[0] == soilType {
			return strconv.ParseFloat(row[1], 64)
		}
	}

	return 0, fmt.Errorf("soil type %s not found in c-values.csv", soilType)
}

// Function to calculate losses based on canal type
func calculateCanalLosses(totalLoss float64, canalType string) float64 {
	maxFlow := 1.515 * totalLoss
	var losses float64

	switch canalType {
	case "unlined":
		losses = 0.66 * maxFlow
	case "lined":
		losses = 0.35 * maxFlow
	case "piped":
		losses = 0.1 * maxFlow
	default:
		fmt.Println("Invalid canal type")
		return 0
	}

	return losses
}


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
			SoilType  string  `json:"soil_type"`
			CanalArea float64 `json:"canal_area"`
			Depth     float64 `json:"depth"`
			Qe        float64 `json:"qe"`
			T         float64 `json:"t"`
			CanalType string  `json:"canal_type"`
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

		// Seepage and evaporation calculations
		cValue, err := getCValue(reqPayload.SoilType)
		if err != nil {
			res.Message = fmt.Sprintf("Error calculating seepage: %v", err)
			return c.JSON(http.StatusInternalServerError, res)
		}
		seepageLosses := cValue * reqPayload.CanalArea * reqPayload.Depth
		evaporationDischarge := reqPayload.Qe / reqPayload.T

		// Canal loss calculations
		canalLosses := calculateCanalLosses(waterReq, reqPayload.CanalType)

		// Response structure
		type jsonRes struct {
			CropWaterRequirement float64 `json:"crop_water_requirement"`
			SeepageLosses        float64 `json:"seepage_losses"`
			EvaporationDischarge float64 `json:"evaporation_discharge"`
			CanalLosses          float64 `json:"canal_losses"`
			OptimalWaterUsage    float64 `json:"optimal_water_usage"`
			Suggestions          string  `json:"suggestions"`
		}

		data := jsonRes{
			CropWaterRequirement: waterReq,
			SeepageLosses:        seepageLosses,
			EvaporationDischarge: evaporationDischarge,
			CanalLosses:          canalLosses,
			OptimalWaterUsage:    0, // Placeholder for optimal water usage
			Suggestions:          "", // Placeholder for suggestions
		}
	
		

		res.Message = "successful"
		res.Data = data
		return c.JSON(http.StatusOK, res)
	}
}
