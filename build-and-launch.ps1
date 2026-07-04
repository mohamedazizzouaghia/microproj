$ErrorActionPreference = "SilentlyContinue"
Write-Host "Stopping any existing Java or Node processes..."
Stop-Process -Name "java" -Force
Stop-Process -Name "node" -Force

$mvn = "C:\Users\aziz\.m2\wrapper\dists\apache-maven-3.9.11\d6d3cbd4012d4c1d840e93277aca316c\bin\mvn.cmd"
$env:JAVA_HOME = "C:\Program Files\Eclipse Adoptium\jdk-17.0.19.10-hotspot"
$env:PATH = "$env:JAVA_HOME\bin;$env:PATH"

Write-Host "=========================================="
Write-Host " Building and Launching EspritConnect"
Write-Host "=========================================="

Write-Host "[1/8] Starting Eureka Server..."
Start-Process -FilePath $mvn -ArgumentList "spring-boot:run -DskipTests" -WorkingDirectory ".\eureka-server" -WindowStyle Minimized

Write-Host "Waiting 10 seconds for Eureka to initialize..."
Start-Sleep -Seconds 10

Write-Host "[2/8] Starting API Gateway..."
Start-Process -FilePath $mvn -ArgumentList "spring-boot:run -DskipTests" -WorkingDirectory ".\api-gateway" -WindowStyle Minimized

Write-Host "[3/8] Starting Auth Service..."
Start-Process -FilePath $mvn -ArgumentList "spring-boot:run -DskipTests" -WorkingDirectory ".\auth-service" -WindowStyle Minimized

Write-Host "[4/8] Starting User Service..."
Start-Process -FilePath $mvn -ArgumentList "spring-boot:run -DskipTests" -WorkingDirectory ".\user-service" -WindowStyle Minimized

Write-Host "[5/8] Starting Event Service..."
Start-Process -FilePath $mvn -ArgumentList "spring-boot:run -DskipTests" -WorkingDirectory ".\event-service" -WindowStyle Minimized

Write-Host "[6/8] Starting Reservation Service..."
Start-Process -FilePath $mvn -ArgumentList "spring-boot:run -DskipTests" -WorkingDirectory ".\reservation-service" -WindowStyle Minimized

Write-Host "[7/8] Starting Club Service..."
Start-Process -FilePath $mvn -ArgumentList "spring-boot:run -DskipTests" -WorkingDirectory ".\club-service" -WindowStyle Minimized

Write-Host "[8/8] Starting Incident Service..."
Start-Process -FilePath $mvn -ArgumentList "spring-boot:run -DskipTests" -WorkingDirectory ".\incident-service" -WindowStyle Minimized

Write-Host "Starting Frontend React App..."
Start-Process -FilePath "npm.cmd" -ArgumentList "run dev" -WorkingDirectory ".\frontend" -WindowStyle Minimized

Write-Host "=========================================="
Write-Host " All Services Launched Successfully!"
Write-Host "=========================================="
Write-Host " Frontend URL:        http://localhost:5173"
Write-Host " API Gateway:         http://localhost:8080"
Write-Host " Eureka Dashboard:    http://localhost:8761"
Write-Host "=========================================="
