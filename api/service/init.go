package service

import (
	"fmt"
	"log"
	"os"
	"time"

	_ "github.com/go-sql-driver/mysql"
	sqlx "github.com/jmoiron/sqlx"
)

func open(driverName string, dbName string, count uint) *sqlx.DB {
	db, err := sqlx.Open(driverName, dbName)
	if err != nil {
		log.Fatalf("%v", err)
	}
	if err = db.Ping(); err != nil {
		time.Sleep(time.Second * 2)
		count--
		fmt.Printf("Retry ... count:%v\n", count)
		return open(driverName, dbName, count)
	} else {
		fmt.Printf("============= Success DB Connecting  =============\n")
		return db
	}
}

func connectDB() *sqlx.DB {
	driverName := "mysql"
	dbName := fmt.Sprintf("%s:%s@tcp(db:3306)/%s?charset=utf8&parseTime=true",
		os.Getenv("MYSQL_USER"), os.Getenv("MYSQL_PASSWORD"), os.Getenv("MYSQL_DATABASE"))

	return open(driverName, dbName, 100)
}
