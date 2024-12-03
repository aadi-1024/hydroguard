package handlers

import (
	"bytes"
	"encoding/json"
	"hydroguard/internal/database"
	"hydroguard/internal/models"
	"net/http"
	"strconv"

	"github.com/labstack/echo/v4"
)

func GetAllDams(d database.Database) echo.HandlerFunc {
	return func(c echo.Context) error {
		res := &models.Response{}
		data, err := d.GetAllDams(c.Request().Context())
		if err != nil {
			res.Message = err.Error()
			return c.JSON(http.StatusInternalServerError, res)
		}

		res.Data = data
		res.Message = "successful"
		return c.JSON(http.StatusOK, res)
	}
}

func CreateDam(d database.Database) echo.HandlerFunc {
	return func(c echo.Context) error {
		res := &models.Response{}
		dam := models.Dam{}
		if err := c.Bind(&dam); err != nil {
			res.Message = err.Error()
			return c.JSON(http.StatusBadRequest, res)
		}

		ret, err := d.CreateDam(c.Request().Context(), dam)
		if err != nil {
			res.Message = err.Error()
			return c.JSON(http.StatusInternalServerError, res)
		}

		res.Data = ret
		res.Message = "successful"
		return c.JSON(http.StatusCreated, res)
	}
}

func UpdateDam(d database.Database) echo.HandlerFunc {
	return func(c echo.Context) error {
		res := &models.Response{}
		dam := models.Dam{}

		if err := c.Bind(&dam); err != nil {
			res.Message = err.Error()
			return c.JSON(http.StatusBadRequest, res)
		}

		ret, err := d.UpdateDam(c.Request().Context(), dam)
		if err != nil {
			res.Message = err.Error()
			return c.JSON(http.StatusInternalServerError, res)
		}

		res.Message = "successful"
		res.Data = ret
		return c.JSON(http.StatusOK, res)
	}
}

func GetWaterCoverArea(d database.Database) echo.HandlerFunc {
	return func(c echo.Context) error {
		res := &models.Response{}
		id, err := strconv.Atoi(c.Param("id"))

		if err != nil {
			res.Message = "invalid id"
			return c.JSON(http.StatusBadRequest, res)
		}

		data, err := d.GetCoordinatesByDam(c.Request().Context(), id)
		if err != nil {
			res.Message = err.Error()
			return c.JSON(http.StatusInternalServerError, res)
		}

		body, _ := json.Marshal(data)

		resp, err := http.Post("http://localhost:5000/surface", "application/json", bytes.NewReader(body))
		if err != nil {
			res.Message = err.Error()
			return c.JSON(http.StatusInternalServerError, res)
		}

		flaskRes := make(map[string]string)
		defer resp.Body.Close()
		err = json.NewDecoder(resp.Body).Decode(&flaskRes)
		if err != nil {
			res.Message = err.Error()
			return c.JSON(http.StatusInternalServerError, res)
		}

		res.Data = flaskRes
		res.Message = "successful"
		return c.JSON(http.StatusOK, res)
	}
}
