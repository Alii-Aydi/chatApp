#Server
mkdir chat-app
cd chat-app
npm init -y
npm install express socket.io
npm install typescript ts-node @types/express @types/socket.io -D
tsc --init

#Client
npx create-react-app client --template typescript
cd client
npm install socket.io-client

