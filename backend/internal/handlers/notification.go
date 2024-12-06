package handlers

import (
	"hydroguard/internal/database"
	"hydroguard/internal/models"
	"net/http"
	"strconv"
	"time"

	"github.com/labstack/echo/v4"
)

func CreateNotification(d database.Database) echo.HandlerFunc {
	return func(c echo.Context) error {
		res := &models.Response{}
		notif := models.Notification{}

		if err := c.Bind(&notif); err != nil {
			res.Message = err.Error()
			return c.JSON(http.StatusBadRequest, res)
		}

		notif.CreatedAt = time.Now()
		notif.Read = false

		ret, err := d.CreateNotification(c.Request().Context(), notif)
		if err != nil {
			res.Message = err.Error()
			return c.JSON(http.StatusInternalServerError, res)
		}

		res.Message = "successful"
		res.Data = ret
		return c.JSON(http.StatusCreated, res)
	}
}

func GetAllNotifications(d database.Database) echo.HandlerFunc {
	return func(c echo.Context) error {
		res := &models.Response{}
		var limit int
		var offset int
		var err error

		limit, err = strconv.Atoi(c.QueryParam("limit"))
		if err != nil {
			limit = 0
		}

		offset, err = strconv.Atoi(c.QueryParam("offset"))
		if err != nil {
			offset = 0
		}

		data, err := d.GetAllNotifications(c.Request().Context(), limit, offset, c.QueryParam("read"))
		if err != nil {
			res.Message = err.Error()
			return c.JSON(http.StatusInternalServerError, res)
		}

		res.Message = "successful"
		res.Data = data
		return c.JSON(http.StatusOK, res)
	}
}
