package handlers

import (
	"bytes"
	"encoding/json"
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
			Key:        "uid",
			Value:      []byte(strconv.Itoa(num)),
			Expiration: 300,
		})

		final := map[string]any{
			"area":    area,
			"token":   num,
			"weather": "filllater",
		}

		res.Message = "successful"
		res.Data = final
		return c.JSON(http.StatusOK, res)
	}
}
