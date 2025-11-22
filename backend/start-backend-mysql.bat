@echo off
echo ========================================
echo Starting FreshCart Backend Server
echo ========================================
echo.
echo Using MySQL Database
echo Make sure MySQL is running and database is set up!
echo Backend will be available at: http://localhost:8080
echo.
echo Press Ctrl+C to stop the server
echo ========================================
echo.

cd /d %~dp0
mvn spring-boot:run

pause

