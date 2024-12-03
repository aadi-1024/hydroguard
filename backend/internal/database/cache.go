package database

import "github.com/bradfitz/gomemcache/memcache"

type Cache struct {
	Conn *memcache.Client
}

func InitCache(dsn string) (Cache, error) {
	c := Cache{memcache.New(dsn)}
	err := c.Conn.Ping()

	return c, err
}
