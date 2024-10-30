const axios = require('axios'); // For HTTP requests
const net = require('net'); // For TCP socket connections
const NTP = require('ntp-time').Client; // For NTP time synchronization
const chalk = require('chalk'); // For colored console logs
const log = console.log; // Shortcut for console.log

// Array of URLs and ports to check, with their respective protocols and whether they are required
const urlArray = [
    // Required URLs
    { required: true, url: "prod.bmq.barbaraiot.com", port: 9883, protocol: "mqtts" },
    { required: true, url: "prod.bmq.barbaraiot.com", port: 7883, protocol: "mqtts" },
    { required: true, url: "prod.bmq.barbaraiot.com/health", port: 80, protocol: "http" },
    { required: true, url: "prod.ota.barbaraiot.com", port: 443, protocol: "https" },
    { required: true, url: "prod.images.barbara.tech", port: 443, protocol: "https" },
    { required: true, url: "prod.images.barbaraiot.com", port: 443, protocol: "https" },
    { required: true, url: "de.icr.io", port: 443, protocol: "https" },
    { required: true, url: "0.pool.ntp.org", port: 123, protocol: "ntp" },
    { required: true, url: "1.pool.ntp.org", port: 123, protocol: "ntp" },
    { required: true, url: "2.pool.ntp.org", port: 123, protocol: "ntp" },
    { required: true, url: "3.pool.ntp.org", port: 123, protocol: "ntp" },
    { required: true, url: "time1.google.com", port: 123, protocol: "ntp" },
    { required: true, url: "time2.google.com", port: 123, protocol: "ntp" },
    { required: true, url: "time3.google.com", port: 123, protocol: "ntp" },
    { required: true, url: "time4.google.com", port: 123, protocol: "ntp" },
    // Optional URLs
    { required: false, url: "auth.docker.io", port: 443, protocol: "https" },
    { required: false, url: "registry.docker.io", port: 443, protocol: "https" },
    { required: false, url: "registry-1.docker.io", port: 443, protocol: "https" },
    { required: false, url: "registry-2.docker.io", port: 443, protocol: "https" },
    { required: false, url: "index.docker.io", port: 443, protocol: "https" },
    { required: false, url: "dseasb33srnrn.cloudfront.net", port: 443, protocol: "https" },
    { required: false, url: "production.cloudflare.docker.com", port: 443, protocol: "https" }
];

// Main function to check the availability of the URLs and ports
async function main() {
    for (let i = 0; i < urlArray.length; i++) {
        const url = urlArray[i];
        try {
            if (url.protocol == "https" || url.protocol == "mqtts") {
                // Check if the port is open for HTTPS or MQTTS protocols
                var result = await checkPortOpen(url.url, url.port);
                printResult(url.url, url.port, url.required, result);
            } else if (url.protocol == "http") {
                // Check if the HTTP URL is accessible
                const response = await axios.get(`http://${url.url}`, { timeout: 2000 });
                printResult(url.url, url.port, url.required, response);
            } else if (url.protocol == "ntp") {
                // Check if the NTP server is reachable
                var result = await checkNtpServer(url.url, url.port, 5000);
                printResult(url.url, url.port, url.required, result);
            }
        } catch (error) {
            // Handle errors and return the error status
            return { status: 'error', error: error.message };
        }
    }
}

/**
 * Function to check if a port is open on a server (without TLS handshake)
 * @param {string} host - The hostname or IP of the server (e.g., 'prod.bmq.barbaraiot.com')
 * @param {number} port - The port number to check (e.g., 9883)
 * @param {number} timeout - Timeout in milliseconds (e.g., 5000ms)
 * @returns {Promise<boolean>} - Returns true if the port is open, false otherwise
 */
async function checkPortOpen(host, port, timeout = 5000) {
    const socket = await new net.Socket();
    socket.setTimeout(timeout);

    // Test if a socket can be opened and return true if successful, false if error or timeout
    return new Promise((resolve) => {
        socket.on('connect', () => {
            socket.end();
            resolve(true);
        });

        socket.on('timeout', () => {
            socket.destroy();
            resolve(false);
        });

        socket.on('error', () => {
            resolve(false);
        });

        socket.connect(port, host);
    });
}

/**
 * Function to check if an NTP server is reachable
 * @param {string} host - The hostname or IP of the NTP server (e.g., 'time1.google.com')
 * @param {number} port - The port number to check (e.g., 123)
 * @param {number} timeout - Timeout in milliseconds (e.g., 5000ms)
 * @returns {Promise<boolean>} - Returns true if the NTP server is reachable, false otherwise
 */
async function checkNtpServer(host, port, timeout) {
    var client = new NTP(host, port, { timeout: timeout });

    try {
        const time = await client.syncTime();
        return !!time;
    } catch (err) {
        return false;
    }
}

/**
 * Function to print the result of the URL and port check
 * @param {string} host - The hostname or IP of the server
 * @param {number} port - The port number
 * @param {boolean} required - Whether the URL is required or optional
 * @param {boolean} result - The result of the check (true if open, false if closed)
 */
async function printResult(host, port, required, result) {
    if (result) {
        if(required) {
            log(chalk.green.bold(`Required url: ${host} is open at port: ${port}`));
        } else {
            log(chalk.green(`Optional url: ${host} is open at port: ${port}`));
        }
    } else {
        if(required) {
            log(chalk.red.bold(`Required url: ${host} is CLOSED at port: ${port}`));
        } else {
            log(chalk.red(`Optional url: ${host} is CLOSED at port: ${port}`));
        }
    }
}

// Execute the main function
main();