# Blockcraft Explorer 🌐

Welcome to the Blockcraft Explorer, the official React/Redux frontend for my [Blockcraft](https://github.com/chrisallenarmbruster/blockcraft) blockchain package! This tool is designed to help you navigate and interact with a Blockcraft blockchain, providing insights into blocks, transactions, and the overall network state. 🚀
<br>

[![Blockcraft Explorer Composite](/public/images/screenshots/composite.png)](https://node1.blockcraft.rev4labs.com)

## Features 🌟

- **Blockchain Overview** 📊: Get a detailed view of the blockchain's current state, including the latest blocks, transactions, and network stats.
- **Chain Integrity Check** ✅: Verify the integrity of the blockchain to ensure its validity and consistency.
- **Block and Transaction Details** 🔍: Explore individual blocks and transactions to understand the flow of data and information across the network.
- **Decentralized Node Visualization** 🌍: View and interact with the network nodes that make up the blockchain infrastructure.

## Working Demo

Check out the [Blockcraft Explorer Demo](https://node1.blockcraft.rev4labs.com)

## Screenshots

### Blockchain Summary (Mobile View)

![Summary - Mobile View](/public/images/screenshots/home-sm-frame.png)

<br>

### Blockchain Summary (Desktop View)

![Summary - Desktop View](/public/images/screenshots/summary.png)

<br>

### Block Detail

![Block Detail](/public/images/screenshots/block-detail.png)

<br>

### Entries or Transactions for a Given Address

![Entries by Account](/public/images/screenshots/entries.png)

<br>

### Entry Details

![Entry Details](/public/images/screenshots/entry-details.png)

<br>

### Connected Peer-to-Peer Nodes

![P2P Nodes](/public/images/screenshots/nodes-sm.png)

<br>

### Custom Blockchain Scroller Component

![Blockchain Scroller Component](/public/images/screenshots/block-scroller.gif)

<br>

### Responsive Menu

<img src="/public/images/screenshots/off-canvas-menu.gif" alt="Responsive Tables" width="450" >

<br>

### Responsive Tables

<img src="/public/images/screenshots/responsive-table.gif" alt="Responsive Tables" width="450" >

<br>

## Getting Started 🚀

### Prerequisites 📋

- Node.js (v14.0.0 or later) 📦
- npm (v6.0.0 or later) 🛠

### Installation 💿

The Blockcraft Explorer is a key part of the Blockcraft ecosystem, designed to seamlessly integrate with your Blockcraft blockchain. It's automatically installed as a dependency when you install the main Blockcraft package, so there's no need for manual installation in most cases. You only need to do this if wanting to customize Blockcraft Explorer. If wanting to customize, run the following command in your project directory:

```bash
npm install git+https://github.com/chrisallenarmbruster/blockcraft-explorer.git
```

## Usage 🛠

### Serving Blockcraft Explorer 🌐

Upon installation of the Blockcraft package, the Blockcraft Explorer assets are automatically placed within your project's `node_modules/blockcraft-explorer/dist` directory. These are production-ready, compiled frontend assets that the Blockcraft blockchain node is configured to serve directly.

When you start your Blockcraft blockchain node, it automatically serves the Blockcraft Explorer on the root HTTP endpoint. This allows for direct interaction with your blockchain through a user-friendly web interface.

### Integrating with Your Blockchain Node 🛠️

Since the Blockcraft Explorer is automatically served by your blockchain node, integration is straightforward. However, here's a quick overview to ensure everything is set up correctly:

1. **Ensure Blockcraft Installation**: The Blockcraft Explorer comes as part of the Blockcraft package. If you haven't done so already, installing Blockcraft automatically adds the Explorer to your project under `node_modules/blockcraft-explorer`.

2. **Run Your Blockchain Node** 🚀: Start your Blockcraft blockchain node as you normally would. It's already configured to serve the Blockcraft Explorer's assets from the `node_modules/blockcraft-explorer/dist` directory.

3. **Access the Explorer** 🌍: Navigate to your blockchain node's HTTP server address in a web browser (such as `http://localhost:3000` if running locally). The Blockcraft Explorer interface should be readily accessible, allowing for intuitive interaction with your blockchain.

### Custom Installation

If you wish to augment or customize the Blockcraft Explorer beyond the default setup, you may consider installing it directly for easier access to its source code. This is particularly useful for developers looking to extend the Explorer's capabilities or integrate it more deeply with custom blockchain functionalities.

To install the Blockcraft Explorer directly:

```bash
npm install git+https://github.com/chrisallenarmbruster/blockcraft-explorer.git
```

### Customizing the Explorer 🔧

While the Blockcraft Explorer works out-of-the-box, you may wish to customize or extend its functionality:

- **Modify the Explorer Frontend** 🎨: Since the frontend assets are compiled and served directly, significant customization will require modifying the source code directly in your `node_modules`, which is not recommended for maintainability. For deeper customization, consider forking the Blockcraft Explorer repository, making your changes, building it, and then installing it from your forked repository.

- **Extend the Backend Integration** 🛠️: You can extend your blockchain node's backend to provide additional APIs or websocket endpoints that the Blockcraft Explorer could interact with. This might involve adding new routes or functionality to your blockchain node application.

For further guidance on customization or integration, please refer to the [official Blockcraft documentation](https://github.com/chrisallenarmbruster/blockcraft-explorer#readme) or reach out to the community for support. 🤝
