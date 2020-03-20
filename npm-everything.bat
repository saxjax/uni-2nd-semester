:: Installing app-dependencies
echo Installing EXPRESS
call npm install express --save
echo Installing MYSQL 
call npm install mysql --save
echo Installing BODY-PARSER
call npm install body-parser --save
echo Installing PATH 
call npm install path --save
echo Installing EJS 
call npm install ejs --save

:: Installing dev-dependencies
echo Installing TAPE 
call npm install tape --save-dev
echo Installing TAPE-PROMISE
call npm install tape-promise --save-dev
echo Installing TAP-SPEC
call npm install tap-spec --save-dev
echo Installing ESLINT
call npm install eslint --save-dev
echo Installing JSDOM
call npm install jsdom --save-dev

pause