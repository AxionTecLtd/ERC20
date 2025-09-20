require("dotenv").config();
const { ethers } = require("hardhat");
const { assert } = require("chai");

describe("MyToken ERC20 Comprehensive Test", () => {
    let myToken;
    let A, B, C, D;

    beforeEach(async () => {
        [A, B, C, D] = await ethers.getSigners();
        const MyToken = await ethers.getContractFactory("MyToken");
        myToken = await MyToken.deploy(1000000);
        await myToken.waitForDeployment();
        console.log("Contract deployed at:", myToken.target);
    });

    it("should verify deployer, totalSupply, and initial balances", async () => {
        assert.equal(A.address, process.env.account1, "部署者地址不匹配");

        const totalSupply = await myToken.totalSupply();
        const totalSupplyHuman = ethers.formatUnits(totalSupply, 18);
        console.log("Total Supply (human):", totalSupplyHuman, "MTK");
        assert.equal(totalSupplyHuman, "1000000.0", "总供应量不正确");

        const balanceA = await myToken.balanceOf(A.address);
        assert.equal(ethers.formatUnits(balanceA, 18), "1000000.0", "部署者余额不正确");
    });

    it("should transfer tokens correctly", async () => {
        await myToken.connect(A).transfer(B.address, ethers.parseUnits("10", 18));
        const balanceB = await myToken.balanceOf(B.address);
        assert.equal(ethers.formatUnits(balanceB, 18), "10.0", "B 的余额不正确");

        const balanceA = await myToken.balanceOf(A.address);
        assert.equal(ethers.formatUnits(balanceA, 18), "999990.0", "A 的余额不正确");
    });

    it("should handle approvals and transferFrom correctly", async () => {
        await myToken.connect(A).approve(C.address, ethers.parseUnits("50", 18));
        const allowance = await myToken.allowance(A.address, C.address);
        assert.equal(ethers.formatUnits(allowance, 18), "50.0", "授权额度不正确");

        await myToken.connect(C).transferFrom(A.address, D.address, ethers.parseUnits("20", 18));
        const balanceD = await myToken.balanceOf(D.address);
        assert.equal(ethers.formatUnits(balanceD, 18), "20.0", "D 的余额不正确");

        const remainingAllowance = await myToken.allowance(A.address, C.address);
        assert.equal(ethers.formatUnits(remainingAllowance, 18), "30.0", "剩余授权额度不正确");
    });

 it("should revert on insufficient balance transfer", async () => {
    let reverted = false;
    try {
        await myToken.connect(B).transfer(A.address, ethers.parseUnits("1000", 18));
    } catch (error) {
        // Hardhat 捕获 custom error 时，用 message.includes
        reverted = error.message.includes("ERC20InsufficientBalance");
    }
    assert.isTrue(reverted, "交易未因余额不足而 revert");
});

it("should revert on transferFrom exceeding allowance", async () => {
    await myToken.connect(A).approve(C.address, ethers.parseUnits("10", 18));
    let reverted = false;
    try {
        await myToken.connect(C).transferFrom(
            A.address,
            D.address,
            ethers.parseUnits("20", 18)
        );
    } catch (error) {
        //  console.log(error); // 可打印看看完整对象
        reverted = error.message.includes("ERC20InsufficientAllowance");
    }
    assert.isTrue(reverted, "交易未因超额 allowance 而 revert");
});


    it("should mint and burn correctly (if functions exist)", async () => {
        if (myToken.mint && myToken.burn) {
            await myToken.mint(B.address, ethers.parseUnits("100", 18));
            const balanceB = await myToken.balanceOf(B.address);
            // 直接比较 BigInt（推荐）
            assert.equal(
                balanceB.toString(),
                ethers.parseUnits("100", 18).toString(), 
                "B 的余额不正确 after mint"
            );

            await myToken.burn(B.address, ethers.parseUnits("50", 18));
            const balanceBAfterBurn = await myToken.balanceOf(B.address);
            assert.equal(
                balanceBAfterBurn.toString(),
                ethers.parseUnits("50", 18).toString(),
                  "B 的余额不正确 after burn"
                );
        }
    });
});
