// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";
import "./ERBProjectNFT.sol";

contract DonationContract is Ownable {
    AggregatorV3Interface internal immutable i_priceFeed;
    ERBProjectNFT public donorNFT;
    
    uint256 public constant MIN_DONATION_USD = 100; // $100 USD with 18 decimal precision
    uint256 private constant PRICE_FEED_TIMEOUT = 3600; // 1 hour
    
    struct Donation {
        uint256 ethAmount;
        uint256 usdAmount; // 18 decimal precision
        uint256 timestamp;
        bool nftMinted;
        uint256 tokenId;
    }

    event DonationReceived(
        address indexed donor,
        uint256 ethAmount,
        uint256 usdAmount,
        bool nftMinted,
        uint256 tokenId
    );

    mapping(address => Donation[]) public donations;

    constructor(address nftContract, address initialOwner) Ownable(initialOwner) {
        donorNFT = ERBProjectNFT(nftContract);
        // Sepolia ETH/USD Price Feed
        i_priceFeed = AggregatorV3Interface(0x694AA1769357215DE4FAC081bf1f309aDC325306);
    }
    
    function setNFTContract(address nftContract) external onlyOwner {
        donorNFT = ERBProjectNFT(nftContract);
    }

    function getETHPrice() public view returns (uint256) {
        (, int price, , uint256 updatedAt, ) = i_priceFeed.latestRoundData();
        require(price > 0, "Invalid price from feed");
        require(block.timestamp - updatedAt <= PRICE_FEED_TIMEOUT, "Price feed stale");
        return uint256(price) * 10**10; // Convert 8 decimals to 18 decimals
    }
    
    function ethToUSD(uint256 ethAmount) public view returns (uint256) {
        uint256 ethPrice = getETHPrice();
        return (ethAmount * ethPrice) / 10**18;
    }

    function donate() external payable {
        require(msg.value > 0, "Donation must be > 0");
        
        uint256 usdAmount = ethToUSD(msg.value);
        bool qualifiesForNFT = usdAmount >= MIN_DONATION_USD * 10**18;
        uint256 tokenId = 0;
        
        // Only mint if qualifies and NFT contract is set
        if (qualifiesForNFT && address(donorNFT) != address(0)) {
            try donorNFT.safeMint(msg.sender) returns (uint256 _tokenId) {
                tokenId = _tokenId;
            } catch {
                qualifiesForNFT = false; // Mark as failed if mint fails
            }
        }
        
        donations[msg.sender].push(Donation({
            ethAmount: msg.value,
            usdAmount: usdAmount,
            timestamp: block.timestamp,
            nftMinted: qualifiesForNFT && tokenId > 0,
            tokenId: tokenId
        }));
        
        emit DonationReceived(msg.sender, msg.value, usdAmount, qualifiesForNFT && tokenId > 0, tokenId);
    }

    function getDonationHistory(address donor) external view returns (Donation[] memory) {
        return donations[donor];
    }

    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        
        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Withdrawal failed");
    }
}