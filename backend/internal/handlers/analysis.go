package handlers

import (
	"bytes"
	"encoding/json"
	"hydroguard/internal/database"
	"hydroguard/internal/models"
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/labstack/echo/v4"
)

func CreateAnalysis(d database.Database) echo.HandlerFunc {
	return func(c echo.Context) error {
		res := &models.Response{}

		id, err := strconv.Atoi(c.Param("id"))
		if err != nil {
			res.Message = err.Error()
			return c.JSON(http.StatusBadRequest, res)
		}

		dam, err := d.GetDamById(c.Request().Context(), id)
		if err != nil {
			res.Message = err.Error()
			return c.JSON(http.StatusBadRequest, res)
		}

		body, _ := json.Marshal(dam)

		resp, err := http.Post("http://localhost:5000/stats", "application/json", bytes.NewReader(body))
		if err != nil {
			res.Message = err.Error()
			return c.JSON(http.StatusInternalServerError, res)
		}

		flaskRes := make(map[string]string)
		defer resp.Body.Close()
		err = json.NewDecoder(resp.Body).Decode(&flaskRes)
		if err != nil {
			log.Println(flaskRes)
			res.Message = err.Error()
			return c.JSON(http.StatusInternalServerError, res)
		}

		cover, _ := strconv.ParseFloat(flaskRes["cover"], 32)
		//0.001 to convert to km^3
		live_vol := 0.001 * cover * float64(dam.MeanDepth)
		sedimentation := dam.GrossVolume - live_vol

		a := models.Analysis{
			DamId:         id,
			WaterCover:    cover,
			Sedimentation: sedimentation,
			LiveVolume:    live_vol,
			CreatedAt:     time.Now(),
		}

		a, err = d.CreateAnalysis(c.Request().Context(), a)
		if err != nil {
			res.Message = err.Error()
			return c.JSON(http.StatusInternalServerError, res)
		}

		res.Message = "successful"
		res.Data = a
		return c.JSON(http.StatusCreated, res)
	}
}

// Do a GET /analysis/id?latest=true to get only the latest analysis
// or skip the query to get all analysis given the dam id
func GetAnalysis(d database.Database) echo.HandlerFunc {
	return func(c echo.Context) error {
		res := &models.Response{}
		latest := c.QueryParam("latest")
		id, err := strconv.Atoi(c.Param("id"))

		if err != nil {
			res.Message = err.Error()
			return c.JSON(http.StatusBadRequest, res)
		}

		limit, err := strconv.Atoi(c.QueryParam("limit"))
		if err != nil || limit < 1 {
			limit = -1
		}

		if latest == "true" {
			data, err := d.GetLatestAnalysis(c.Request().Context(), id)
			if err != nil {
				res.Message = err.Error()
				return c.JSON(http.StatusInternalServerError, res)
			}

			res.Message = "successful"
			res.Data = data
			return c.JSON(http.StatusOK, res)
		}

		//TODO: change db call once implemented
		data, err := d.GetAllAnalysis(c.Request().Context(), id, limit)
		if err != nil {
			res.Message = err.Error()
			return c.JSON(http.StatusInternalServerError, res)
		}

		res.Message = "successful"
		res.Data = data
		return c.JSON(http.StatusOK, res)
	}
}
