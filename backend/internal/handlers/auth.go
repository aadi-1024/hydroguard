package handlers

import (
	"hydroguard/internal/database"
	"hydroguard/internal/models"
	"net/http"
	"time"

	"github.com/labstack/echo/v4"
	"golang.org/x/crypto/bcrypt"
)

func CreateUser(d database.Database) echo.HandlerFunc {
	return func(c echo.Context) error {
		res := &models.Response{}
		user := models.User{}

		if err := c.Bind(&user); err != nil {
			res.Message = err.Error()
			return c.JSON(http.StatusBadRequest, res)
		}

		hashedPass, err := bcrypt.GenerateFromPassword([]byte(user.Password), -1)
		if err != nil {
			res.Message = err.Error()
			return c.JSON(http.StatusBadRequest, res)
		}

		user.Password = string(hashedPass)
		ret, err := d.CreateUser(c.Request().Context(), user)

		if err != nil {
			res.Message = err.Error()
			return c.JSON(http.StatusInternalServerError, res)
		}

		ret.Password = ""
		res.Message = "successful"
		res.Data = ret

		return c.JSON(http.StatusCreated, res)
	}
}

// expects email and password
func LoginUser(d database.Database) echo.HandlerFunc {
	return func(c echo.Context) error {
		res := &models.Response{}
		user := models.User{}

		if err := c.Bind(&user); err != nil {
			res.Message = err.Error()
			return c.JSON(http.StatusBadRequest, res)
		}

		actualUser, err := d.GetUserByEmail(c.Request().Context(), user.Email)
		if err != nil {
			res.Message = err.Error()
			return c.JSON(http.StatusInternalServerError, res)
		}

		if err := bcrypt.CompareHashAndPassword([]byte(actualUser.Password), []byte(user.Password)); err != nil {
			res.Message = "invalid credentials"
			return c.JSON(http.StatusUnauthorized, res)
		}

		cookie := http.Cookie{
			Name: "jwt",
			//TODO: replace with jwt token
			Value:    "abcd",
			Secure:   false,
			HttpOnly: true,
			Expires:  time.Now().Add(30 * 24 * time.Hour),
		}

		c.SetCookie(&cookie)

		res.Message = "successful"
		return c.JSON(http.StatusOK, res)
	}
}
