
const {ethers }= require("hardhat");

async function main() {
    // 获取本地区块链的前两个账户
    const [account1, account2] = await ethers.getSigners();
    console.log("部署账户：",account1.address);

    const MyToken = await ethers.getContractFactory("MyToken");

    // 传入构造函数参数，比如初始供应量
    const myToken = await MyToken.deploy(1000000); // 传入初始供应量，比如 100万
    
    // 等待部署完成 (v6 用 waitForDeployment)
    await myToken.waitForDeployment();

    console.log("MyToken 部署成功，地址:", myToken.target);
};



main()
    .then(() =>{process.exit(0)})
    .catch(
        (erro)=>{
            console.log(erro)
            process.exit(1)
        });