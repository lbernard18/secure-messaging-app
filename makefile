# Compile and run server
run:
	del src\*.js
	npx tsc -p .
	node src/server.js

# Compile server without running it
build:
	npx tsc src/server.ts
