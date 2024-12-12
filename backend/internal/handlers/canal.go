package handlers

import (
	"encoding/csv"
	"hydroguard/internal/database"
	"hydroguard/internal/models"
	"io"
	"log"
	"net/http"
	"os"
	"strconv"
	"strings"

	"github.com/labstack/echo/v4"
)

func PredictCanalStuff(db database.Database) echo.HandlerFunc {
	// Read and parse CSV file at initialization
	soilCValues := make(map[string]float32)

	file, err := os.Open("c-value.csv")
	if err != nil {
		log.Printf("Error opening CSV file: %v", err)
		return func(c echo.Context) error {
			return c.JSON(http.StatusInternalServerError, &models.Response{
				Message: "Internal server error",
			})
		}
	}
	defer file.Close()

	reader := csv.NewReader(file)
	// Skip header row
	_, err = reader.Read()
	if err != nil {
		log.Printf("Error reading CSV header: %v", err)
		return func(c echo.Context) error {
			return c.JSON(http.StatusInternalServerError, &models.Response{
				Message: "Internal server error",
			})
		}
	}

	// Read all records and populate the map
	for {
		record, err := reader.Read()
		if err == io.EOF {
			break
		}
		if err != nil {
			log.Printf("Error reading CSV record: %v", err)
			continue
		}

		if len(record) != 2 {
			log.Printf("Invalid CSV record format: %v", record)
			continue
		}

		cValue, err := strconv.ParseFloat(record[1], 32)
		if err != nil {
			log.Printf("Error parsing c_avg value: %v", err)
			continue
		}

		soilCValues[strings.ToLower(record[0])] = float32(cValue)
	}

	return func(c echo.Context) error {
		res := &models.Response{}

		type Canal struct {
			Qe          float32 `json:"qe,omitempty"`
			Width       float32 `json:"width,omitempty"`
			SoilType    string  `json:"soil_type,omitempty"`
			CanalArea   float32 `json:"canal_area,omitempty"`
			CanalType   string  `json:"canal_type,omitempty"`
			CanalDepth  float32 `json:"canal_depth,omitempty"`
			CanalLength float32 `json:"canal_length,omitempty"`
		}

		x := Canal{}
		if err := c.Bind(&x); err != nil {
			res.Message = err.Error()
			return c.JSON(http.StatusBadRequest, res)
		}

		// Validate input data
		if x.SoilType == "" || x.CanalArea == 0 || x.CanalDepth == 0 || x.CanalLength == 0 || x.Qe == 0 {
			res.Message = "Missing required parameters"
			return c.JSON(http.StatusBadRequest, res)
		}

		// Get c_avg value for the soil type
		cValue, exists := soilCValues[strings.ToLower(x.SoilType)]
		if !exists {
			res.Message = "Invalid soil type"
			return c.JSON(http.StatusBadRequest, res)
		}

		// Calculate seepage loss
		seepageLoss := cValue * x.CanalArea * x.CanalDepth

		// Calculate evaporation loss
		evaporationLoss := x.Qe * x.CanalLength

		// Calculate total loss
		totalLoss := seepageLoss + evaporationLoss

		// Prepare response
		type Result struct {
			SeepageLoss     float32 `json:"seepage_loss"`
			EvaporationLoss float32 `json:"evaporation_loss"`
			TotalLoss       float32 `json:"total_loss"`
		}

		result := Result{
			SeepageLoss:     seepageLoss,
			EvaporationLoss: evaporationLoss,
			TotalLoss:       totalLoss,
		}

		res.Message = "Success"
		res.Data = result

		return c.JSON(http.StatusOK, res)
	}
}
