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
	// dam.GET("/cover/:id", handlers.GetWaterCoverArea(app.db))
	dam.GET("/analysis/:id", handlers.GetAnalysis(app.db))
	dam.POST("/analysis/:id", handlers.CreateAnalysis(app.db))
	dam.GET("", handlers.GetAllDams(app.db))
	dam.GET("/:id", handlers.GetDamById(app.db))
	dam.PUT("", handlers.UpdateDam(app.db))

	notif := e.Group("/notification")
	notif.GET("", handlers.GetAllNotifications(app.db))
	notif.GET("/read/:id", handlers.MarkNotifAsRead(app.db))
	notif.POST("", handlers.CreateNotification(app.db))

	crops := e.Group("/crops")
	crops.POST("/init", handlers.InitiateRequest(app.db, app.cache))
	crops.POST("/init/old", handlers.InitiateRequestOld(app.db, app.cache))
	crops.POST("/process/old", handlers.ProcessRequestOld(app.db, app.cache))
	crops.POST("/process", handlers.ProcessRequest(app.db, app.cache))
	crops.GET("/analysis", handlers.GetAllCropAnalysis(app.db))
	crops.GET("/analysis/:id", handlers.GetCropAnalysisById(app.db))
	crops.GET("/analysis/dam/:id", handlers.GetCropAnalysisByDamId(app.db))
	crops.POST("/analysis", handlers.CreateCropAnalysis(app.db))

	e.POST("/canals", handlers.PredictCanalStuff(app.db))
}
