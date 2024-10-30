# Barbara Network Tester

Barbara Network Tester is a Docker application designed to validate connectivity with the necessary services required to deploy a Barbara Device.

## Functionality

The tool performs the following checks:

1. **HTTPS and MQTTS Ports**: It checks if the specified ports for HTTPS and MQTTS protocols are open.
2. **HTTP URLs**: It verifies if the specified HTTP URLs are accessible.
3. **NTP Servers**: It checks if the specified NTP servers are reachable.

## How It Works

1. **Configuration**: The URLs and ports to be checked are defined in an array called `urlArray`. Each entry specifies whether the URL is required, the URL itself, the port number, and the protocol.

2. **Main Function**: The `main` function iterates over the `urlArray` and performs the appropriate check based on the protocol:
   - For HTTPS and MQTTS, it uses the `checkPortOpen` function to verify if the port is open.
   - For HTTP, it uses the `axios` library to send a GET request to the URL.
   - For NTP, it uses the `checkNtpServer` function to verify if the NTP server is reachable.

3. **Port Check**: The `checkPortOpen` function attempts to open a TCP socket to the specified host and port. It returns `true` if the connection is successful and `false` if there is an error or timeout.

4. **NTP Check**: The `checkNtpServer` function uses the `ntp-time` library to synchronize time with the specified NTP server. It returns `true` if the synchronization is successful and `false` otherwise.

5. **Result Logging**: The `printResult` function logs the result of each check to the console. It uses the `chalk` library to color-code the output, indicating whether the URL is open or closed.

## Example Usage

The script checks the following URLs and ports:

- `prod.bmq.barbaraiot.com` on ports 9883 and 7883 for MQTTS
- `prod.bmq.barbaraiot.com/health` on port 80 for HTTP
- `prod.ota.barbaraiot.com` on port 443 for HTTPS
- `prod.images.barbara.tech` and `prod.images.barbaraiot.com` on port 443 for HTTPS
- `de.icr.io` on port 443 for HTTPS
- Various NTP servers on port 123

## Running the Script

To run the script using Docker, follow these steps:

1. **Build the Docker Image**: Navigate to the directory containing the Dockerfile and build the Docker image.

    ```sh
    docker build -t barbara-network-tester .
    ```

2. **Run the Docker Container**: Execute the Docker container with `network_mode: host`.

    ```sh
    docker run --rm --network host barbara-network-tester
    ```

## Running the Script with Docker Compose

To run the script using Docker Compose, follow these steps:

1. **Run the Docker Compose Command**: Execute the following command to build and run the Docker Compose services.

    ```sh
    docker-compose up --build
    ```

## Dependencies

The script requires the following Node.js modules:

- `axios`: For making HTTP requests
- `net`: For creating TCP socket connections
- `ntp-time`: For NTP time synchronization
- `dgram`: For creating UDP socket connections
- `chalk`: For colored console logs

These dependencies are installed as part of the Docker image build process.