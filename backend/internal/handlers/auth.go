package handlers

import (
	"hydroguard/internal/database"
	"hydroguard/internal/models"
	"log"
	"math/rand/v2"
	"net/http"
	"strconv"
	"time"

	"github.com/bradfitz/gomemcache/memcache"
	"github.com/golang-jwt/jwt/v5"
	"github.com/labstack/echo/v4"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
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

		clms := &models.Claims{}
		clms.Email = user.Email
		clms.ExpiresAt = jwt.NewNumericDate(time.Now().Add(30 * 24 * time.Hour))
		clms.Issuer = "hydroguard"

		token := jwt.NewWithClaims(jwt.SigningMethodHS512, clms)
		tkn, _ := token.SignedString([]byte("HUGE_SECRET"))

		cookie := http.Cookie{
			Name:     "jwt",
			Value:    tkn,
			Secure:   false,
			HttpOnly: true,
			Expires:  time.Now().Add(30 * 24 * time.Hour),
		}

		c.SetCookie(&cookie)

		res.Message = "successful"
		return c.JSON(http.StatusOK, res)
	}
}

func ResetPasswordRequestOTP(d database.Database, cache database.Cache) echo.HandlerFunc {
	return func(c echo.Context) error {
		res := &models.Response{}
		user := models.User{}

		if err := c.Bind(&user); err != nil {
			res.Message = err.Error()
			return c.JSON(http.StatusBadRequest, res)
		}

		_, err := d.GetUserByEmail(c.Request().Context(), user.Email)
		if err == gorm.ErrRecordNotFound {
			res.Message = "user not found"
			return c.JSON(http.StatusNotFound, res)
		} else if err != nil {
			res.Message = err.Error()
			return c.JSON(http.StatusInternalServerError, res)
		}

		//100,000 to 999,999
		otp := rand.IntN(900_000) + 100_000
		log.Println(otp)

		item := memcache.Item{
			Key:        user.Email,
			Value:      []byte(strconv.Itoa(otp)),
			Expiration: 300, //5 minutes
		}

		if err := cache.Conn.Add(&item); err == memcache.ErrNotStored {
			res.Message = "wait before requesting OTP again"
			return c.JSON(http.StatusTooEarly, res)
		} else if err != nil {
			res.Message = err.Error()
			return c.JSON(http.StatusInternalServerError, res)
		}

		res.Message = "successful"
		return c.JSON(http.StatusOK, res)
	}
}

func ResetPasswordVerify(d database.Database, cache database.Cache) echo.HandlerFunc {
	return func(c echo.Context) error {
		res := &models.Response{}

		type payload struct {
			models.User
			Otp string `json:"otp"`
		}

		req := payload{}

		if err := c.Bind(&req); err != nil {
			res.Message = err.Error()
			return c.JSON(http.StatusBadRequest, res)
		}

		item, err := cache.Conn.Get(req.Email)
		if err != nil {
			res.Message = "check email or try again"
			return c.JSON(http.StatusNotFound, res)
		}

		if req.Otp != string(item.Value) {
			res.Message = "invalid otp"
			return c.JSON(http.StatusUnauthorized, res)
		}

		if err := cache.Conn.Delete(req.Email); err != nil {
			log.Println(err.Error())
		}

		hashedPass, err := bcrypt.GenerateFromPassword([]byte(req.Password), -1)
		if err != nil {
			res.Message = err.Error()
			return c.JSON(http.StatusInternalServerError, res)
		}
		req.Password = string(hashedPass)

		if _, err := d.UpdateUser(c.Request().Context(), req.User); err != nil {
			res.Message = err.Error()
			return c.JSON(http.StatusInternalServerError, res)
		}

		res.Message = "successful"
		return c.JSON(http.StatusOK, res)
	}
}
