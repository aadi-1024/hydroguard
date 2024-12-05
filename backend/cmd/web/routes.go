package main

import (
	"hydroguard/internal/handlers"
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func SetupRoutes(e *echo.Echo) {
	e.Use(middleware.CORS())
	e.GET("/ping", func(c echo.Context) error {
		return c.String(http.StatusOK, "pong")
	})

	e.POST("/login", handlers.LoginUser(app.db))
	e.POST("/register", handlers.CreateUser(app.db))
	e.POST("/reset/request", handlers.ResetPasswordRequestOTP(app.db, app.cache, app.mailer))
	e.POST("/reset/verify", handlers.ResetPasswordVerify(app.db, app.cache, app.mailer))

	dam := e.Group("/dam")
	dam.POST("", handlers.CreateDam(app.db))
	dam.GET("/cover/:id", handlers.GetWaterCoverArea(app.db))
	dam.GET("", handlers.GetAllDams(app.db))
	dam.GET("/:id", handlers.GetDamById(app.db))
	dam.PUT("", handlers.UpdateDam(app.db))
}
