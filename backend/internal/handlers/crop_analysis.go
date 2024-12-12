package handlers

import (
	"hydroguard/internal/database"
	"hydroguard/internal/models"
	"net/http"
	"strconv"

	"github.com/labstack/echo/v4"
)

func GetAllCropAnalysis(d database.Database) echo.HandlerFunc {
	return func(c echo.Context) error {
		res := &models.Response{}

		data, err := d.GetAllCropAnalysis(c.Request().Context())
		if err != nil {
			res.Message = err.Error()
			return c.JSON(http.StatusInternalServerError, res)
		}

		res.Message = "successful"
		res.Data = data
		return c.JSON(http.StatusOK, res)
	}
}

func GetCropAnalysisById(d database.Database) echo.HandlerFunc {
	return func(c echo.Context) error {
		res := &models.Response{}
		id, err := strconv.Atoi(c.Param("id"))

		if err != nil {
			res.Message = err.Error()
			return c.JSON(http.StatusBadRequest, res)
		}

		data, err := d.GetCropAnalysisById(c.Request().Context(), id)
		if err != nil {
			res.Message = err.Error()
			return c.JSON(http.StatusInternalServerError, res)
		}

		res.Message = "successful"
		res.Data = data
		return c.JSON(http.StatusOK, res)
	}
}

func GetCropAnalysisByDamId(d database.Database) echo.HandlerFunc {
	return func(c echo.Context) error {
		res := &models.Response{}
		id, err := strconv.Atoi(c.Param("id"))

		if err != nil {
			res.Message = err.Error()
			return c.JSON(http.StatusBadRequest, res)
		}

		data, err := d.GetCropAnalysisByDamId(c.Request().Context(), id)
		if err != nil {
			res.Message = err.Error()
			return c.JSON(http.StatusInternalServerError, res)
		}

		res.Message = "successful"
		res.Data = data
		return c.JSON(http.StatusOK, res)
	}
}

func CreateCropAnalysis(d database.Database) echo.HandlerFunc {
	return func(c echo.Context) error {
		res := &models.Response{}
		payload := models.CropAnalysis{}

		if err := c.Bind(&payload); err != nil {
			res.Message = err.Error()
			return c.JSON(http.StatusBadRequest, res)
		}

		payload, err := d.CreateCropAnalysis(c.Request().Context(), payload)
		if err != nil {
			res.Message = err.Error()
			return c.JSON(http.StatusInternalServerError, res)
		}

		res.Data = payload
		res.Message = "successful"
		return c.JSON(http.StatusCreated, res)
	}
}
