package main

import (
	"log"
	"net/http"
	"os"
	"time"
)

func ServeHTTP(w http.ResponseWriter, r *http.Request) {
	video, err := os.Open("demo2.mp4")
	if err != nil {
		log.Fatal(err)
	}
	defer video.Close()
	http.ServeContent(w, r, "video.mp4", time.Now(), video)
}
func main() {
	http.HandleFunc("/api/video", ServeHTTP)
	http.ListenAndServe(":8000", nil)
}
