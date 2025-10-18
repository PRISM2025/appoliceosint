@echo off
echo Starting deployment to Google Cloud...
echo Project Location: D:\Websites\OSINT WEBSITE
echo.

echo Navigating to project directory...
cd /d "D:\Websites\OSINT WEBSITE"

echo.
echo Setting project...
gcloud config set project appoliceosint-a2fa9

echo.
echo Deploying to App Engine...
gcloud app deploy --quiet

echo.
echo Deployment complete!
echo.
echo Opening app in browser...
gcloud app browse

echo.
echo Press any key to exit...
pause