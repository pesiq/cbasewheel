# Coinbase wheel spinner

### Clone the Repository

Clone the repository to your local machine using the following command:
```
git clone https://github.com/pesiq/cbasewheel.git
```
Navigate to the project directory:
```
cd cbasewheel
```
### Install Dependencies

Install the project dependencies using npm:
```
npm install
```
### Configuration

Add your private keys, proxies, and password to the respective files in the `secrets` directory.

**Private Keys**: Add your private keys to `secrets/wallets.txt`. Each key should be on a new line.
```
PRIVATE_KEY_1
PRIVATE_KEY_2
...
```
**Proxies**: Add your proxies to `secrets/proxies.txt`. Each proxy should be on a new line.
Proxy should be formatted this way: `` ip:port:username:password``
```
PROXY_1
PROXY_2
...
```

**Password**: Add your password to `secrets/password.txt`. This password will be used to login to wallet.
Use a strong password or script will crash.
```
YOUR_PASSWORD
```

### Run the Project

Start the project using the following command:
```
npm run dev
```
