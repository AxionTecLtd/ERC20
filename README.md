
---

# 🟦 Remix ERC721 调试操作表（MyNFT）

## Step 0. 部署合约

1. 打开 **Remix → Deploy & Run Transactions**
2. 确认环境选择 `Injected Provider - MetaMask`（用你钱包账号）
3. 在 `Deploy` 面板里，选中 `MyNFT` 合约，点 **Deploy**
4. 成功后，在 **Deployed Contracts** 区域能看到合约地址

---

## Step 1. 检查合约拥有者

* 在合约函数里找到 `owner()`
* 点击调用
  👉 返回结果：部署者的钱包地址（应该是你当前 MetaMask 账号）

---

## Step 2. Mint 第一个 NFT

* 找到 `mint(address to)`
* 在输入框里填你自己钱包地址（MetaMask 地址）
* 点击 **transact**
  👉 预期结果：

  * `tokenId=0` 被 mint 给你
  * 交易日志里会有 `Transfer` 事件

---

## Step 3. 验证 NFT 持有人

* 调用 `ownerOf(0)`
  👉 预期结果：返回你的地址

* 调用 `balanceOf(你的地址)`
  👉 预期结果：返回 `1`（你现在拥有 1 个 NFT）

---

## Step 4. Mint 第二个 NFT

* 再次调用 `mint(address to)`，这次填另一个测试账号地址（比如 MetaMask 切换到账户2，复制它的地址）
  👉 预期结果：

  * `tokenId=1` 被 mint 给这个新地址
  * `ownerOf(1)` = 新地址
  * `balanceOf(新地址)` = `1`

---

## Step 5. 转移 NFT

* 切换到 Alice（NFT 持有人）的钱包
* 调用 `transferFrom(from, to, tokenId)`

  * from = Alice 地址
  * to = Bob 地址
  * tokenId = 0
    👉 预期结果：
  * `ownerOf(0)` = Bob 地址
  * `balanceOf(Alice)` = 0
  * `balanceOf(Bob)` = 1

---

## Step 6. 检查下一个可 mint 的 tokenId

* 调用 `nextTokenId()`
  👉 预期结果：返回 `2`（说明下次 mint 会是 tokenId=2）

---

# 🟦 调试总结

* **owner()**：验证谁是合约拥有者
* **mint()**：只能合约拥有者调用，生成 NFT
* **ownerOf(tokenId)**：查看某个 NFT 属于谁
* **balanceOf(address)**：查看某个地址持有多少 NFT
* **transferFrom()**：NFT 转移

---


# 二、Remix 部署 ERC-1155 合约及调试操作：快速测试 mint、查询余额、批量 mint 和转账。

---

## 1️⃣ 准备环境

* Remix → Environment 选择 **JavaScript VM**（内置测试链）
* 确保你部署的合约地址显示在 **Deployed Contracts**

---

## 2️⃣ Mint 单个代币

假设 Alice 地址是 Remix 默认的第二个账户（accounts\[1]），mint id=1，数量=100：

1. 打开合约 → 点击 `mint`
2. 输入参数：

```
to: 0xAb... (Alice 地址)
id: 1
amount: 100
```

3. 点击 **transact** → 等待交易完成
4. 检查 Remix 下方 Transaction Log 是否成功

---

## 3️⃣ 查询余额

ERC-1155 查询余额函数：

```solidity
balanceOf(address account, uint256 id)
```

操作步骤：

1. 找到合约的 `balanceOf` 函数
2. 输入：

```
account: Alice 地址
id: 1
```

3. 点击 call → 会返回 Alice 的代币数量，例如 100

---

## 4️⃣ Mint 批量代币

假设批量 mint 两种代币 id=\[2,3]，数量=\[1,10]：

1. 找到 `mintBatch`
2. 输入参数：

```
to: Alice 地址
ids: [2,3]
amounts: [1,10]
```

3. 点击 **transact** → 等待完成
4. 使用 `balanceOf` 分别查询 id=2 和 id=3 的余额

---

## 5️⃣ 转账单个代币

ERC-1155 转账函数：

```solidity
safeTransferFrom(address from, address to, uint256 id, uint256 amount, bytes data)
```

示例：Alice 给 Bob 转 10 个 id=1：

* from: Alice 地址
* to: Bob 地址
* id: 1
* amount: 10
* data: ""（空字符串）

点击 **transact** → 完成后查询 Bob 的余额

---

## 6️⃣ 批量转账

ERC-1155 支持批量转账：

```solidity
safeBatchTransferFrom(address from, address to, uint256[] ids, uint256[] amounts, bytes data)
```

示例：Alice 给 Bob 转 id=\[2,3]，amount=\[1,5]：

* from: Alice 地址
* to: Bob 地址
* ids: \[2,3]
* amounts: \[1,5]
* data: ""

点击 **transact** → 完成后查询 Bob 的余额

---

## 7️⃣ 注意事项

1. **所有操作** mint、transfer 都要使用 Remix **账户签名**
2. **批量操作时**，`ids` 和 `amounts` 长度必须一致
3. NFT 的 amount=1，FT 的 amount>1
4. **只允许 owner 调用 mint / mintBatch**（如果你合约里用了 `onlyOwner`）

---


