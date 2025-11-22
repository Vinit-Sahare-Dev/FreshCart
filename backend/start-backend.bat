@echo off
echo ========================================
echo Starting FreshCart Backend Server
echo ========================================
echo.
echo Using H2 In-Memory Database (No MySQL needed!)
echo Backend will be available at: http://localhost:8080
echo.
echo Press Ctrl+C to stop the server
echo ========================================
echo.

cd /d %~dp0
mvn spring-boot:run -Dspring-boot.run.profiles=dev

pause

