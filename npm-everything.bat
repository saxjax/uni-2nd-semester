:: Setting up
@echo off
echo Getting ready...
echo Node version:
call node --version
IF errorlevel 1 (
    Start "" https://nodejs.org/en/#home-downloadhead
    echo Goto https://nodejs.org/en/#home-downloadhead to download node. After that you can run this file again to install the dependencies.
    pause
    exit 
)
call del /f package.json
call del /f package-lock.json
call rmdir /Q /S C:\Users\%USERNAME%\AppData\Roaming\npm-cache\_logs
call rmdir /Q /S node_modules
call npm cache verify
:: Add package.json
call npm init -y

:: Installing app-dependencies
echo =====================================================================================
echo Installing EXPRESS
call npm install express --save
echo =====================================================================================
echo Installing MYSQL 
call npm install mysql --save
echo =====================================================================================
echo Installing BODY-PARSER
call npm install body-parser --save
echo =====================================================================================
echo Installing PATH 
call npm install path --save
echo =====================================================================================
echo Installing EJS 
call npm install ejs --save
echo =====================================================================================
echo Installing EXPRESS-SESSION 
call npm install express-session --save

:: Installing dev-dependencies
echo =====================================================================================
echo Installing TAPE 
call npm install tape --save-dev
echo =====================================================================================
echo Installing TAPE-PROMISE
call npm install tape-promise --save-dev
echo =====================================================================================
echo Installing TAP-SPEC
call npm install tap-spec --save-dev
echo =====================================================================================
echo Installing JSDOM
call npm install jsdom --save-dev
echo =====================================================================================
echo Installing ESLINT
call npm install eslint --save-dev
echo =====================================================================================
echo Installing ESLINT-airbnb-base
call npm install eslint-config-airbnb-base --save-dev
echo =====================================================================================
echo Installing ESLINT-plugin-import
call npm install eslint-plugin-import --save-dev
echo =====================================================================================
echo Installing ESLINT-plugin-ejs
call npm install eslint-plugin-ejs --save-dev

:: Installing global dependencies
echo Nodemon version:
call nodemon --version
IF errorlevel 1 (
    echo =====================================================================================
    echo Installing NODEMON
    call npm install -g nodemon
)
echo =====================================================================================

echo Done!
echo You can safely close this window now.
pause