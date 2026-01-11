# Compile and run server
run:
	npx tsc src/server.ts
	node src/server.js

# Compile server without running it
build:
	npx tsc src/server.ts
