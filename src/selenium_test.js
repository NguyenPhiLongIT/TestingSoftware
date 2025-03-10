import { By, Builder, until, Select, Browser } from 'selenium-webdriver';
import assert from 'assert';
import { resolve } from 'path';

const BASE_URL = 'http://localhost:5173/';

/**
 * Function to clear and input data into a field
 */
async function inputField(element, data) {
  await element.clear();
  await element.sendKeys(data);
}

/**
 * Function to check if an element has the required attribute
 */
async function isRequired(element) {
  try {
    let required = await element.getAttribute("required");
    return required !== null;
  } catch (error) {
    console.error(`⚠️ Error checking required attribute: ${error.message}`);
    return false;
  }
}

/**
 * Kiểm thử toàn bộ form đăng nhập
 */
async function testLoginForm(driver) {
  try {
    const user = await driver.findElementById(By.xpath('//*[@id="userDropdown"]/text()'))
    console.log(`User already logged in!`);

    return user != null;
  } catch (error) {
    console.log("User is not logged in!");
  }

  // Test cases gồm cả username & password
  const testCases = [
    { username: "", password: "", expectedError: "Username and Password are required" },
    { username: "user@#$%", password: "short", expectedError: "Tên đăng nhập hoặc mật khẩu không đúng" },
    { username: "admin", password: "wrongpass", expectedError: "Tên đăng nhập hoặc mật khẩu không đúng" },
    { username: "admin", password: "admin", expectedError: "Đăng nhập thành công!" }
  ];

  // Chờ đến trang đăng nhập
  await driver.wait(until.elementLocated(
    By.xpath('//*[@id="app"]/div/div[1]/div/div/div[3]/div/div[1]/li/a[2]/button')),
    5000
  ).click();

  let usernameInput = await driver.wait(until.elementLocated(By.id("username")), 5000);
  let passwordInput = await driver.findElement(By.id("password"));
  let loginButton = await driver.findElement(By.xpath('//button[@type="submit"]'));

  for (let test of testCases) {
    console.log(`🔄 Testing: Username = "${test.username}", Password = "${test.password}"`);

    await inputField(usernameInput, test.username);
    await inputField(passwordInput, test.password);
    await loginButton.click();

    await driver.sleep(500); // Chờ xử lý validation

    if (await isRequired(usernameInput) && test.username === '') {
      console.error(`❌ The field "username" is required but received an empty value.`);
      continue;
    }

    if (await isRequired(passwordInput) && test.password === '') {
      console.error(`❌ The field "password" is required but received an empty value.`);
      continue;
    }

    try {
      let errorElement = await driver.wait(
        until.elementLocated(
          By.xpath('//*[@id="app-content"]/div/form/div[4]/div'),
          3000
        ));
      let errorText = await errorElement.getText();

      assert.strictEqual(errorText, test.expectedError, `❌ Expected "${test.expectedError}", but got "${errorText}"`);
      console.log(`✅ Passed: ${test.expectedError}`);
    } catch (error) {
      console.error(`❌ Failed: ${error.message}`);
    }
  }

  return true;
}

async function testUploadForm(driver) {
  // Test cases
  const testCases = [
    { title: "English 1", category: 1, filename: "D:\\Downloads\\toolbox-installer-HdzdVevku9km_fZhvAmrcQ.exe", description: "", expectedError: "File type not supported" },
    { title: "English 1", category: 1, filename: "D:\\Downloads\\document.pdf", description: "", expectedError: "Tài liệu đã được upload thành công!" }
  ];

  // Locate form elements  
  let titleInput = await driver.wait(until.elementLocated(By.id("title")), 5000);
  let categoryDropdown = await driver.findElement(By.id("categories"));
  let fileInput = await driver.findElement(By.id("formFile"));
  let descriptionInput = await driver.findElement(By.xpath('//*[@id="app-content"]/div/div[2]/div/form/div/div[4]/textarea'));
  let submitButton = await driver.findElement(By.xpath('//*[@id="app-content"]/div/div[2]/div/form/div/div[5]/button'));

  for (let test of testCases) {
    console.log(`🔄 Testing file: "${test.filename}"`);

    // await inputField(titleInput, test.title);
    await titleInput.clear();
    await titleInput.sendKeys(test.title);

    // Select category from dropdown  
    let categoryOption = await categoryDropdown.findElement(By.css(`option[value='${test.category}']`));
    await categoryOption.click();

    await fileInput.clear();
    try {
      await fileInput.sendKeys(test.filename);
    } catch (e) {
      console.error(`�� Failed to upload file: ${e.message}`);
    }
    await driver.sleep(500); // Wait for file upload
    try {
      await driver.switchTo().alert().accept(); // Đóng alert nếu xuất hiện
    } catch (error) {
      console.log("No alert found, continuing test...");
    }

    await descriptionInput.clear();
    await descriptionInput.sendKeys(test.description);
    // await inputField(descriptionInput, test.description);
    await driver.sleep(500); // Wait for form submission

    await submitButton.click();
    await driver.sleep(1000); // Wait for validation  

    try {
      let errorElement = await driver.wait(
        until.elementLocated(
          By.xpath('//*[@id="app-content"]/div/div[3]/div'),
          3000
        ),
        5000
      );
      let errorText = await errorElement.getText();

      assert.strictEqual(errorText, test.expectedError, `❌ Expected "${test.expectedError}", but got "${errorText}"`);
      console.log(`✅ Passed: ${test.expectedError}`);

      let modal = await driver.findElement(By.xpath('//*[@id="app-content"]/div/div[3]'));
      if (await modal.isDisplayed()) {
        console.log("Modal detected. Attempting to close...");
        await driver.wait(
          until.elementLocated(By.xpath('//*[@id="app-content"]/div/div[3]/div/button')),
          5000
        ).click();
        await driver.sleep(500); // Chờ modal đóng
      }

    } catch (error) {
      console.error(`❌ Failed: ${error.message}`);
    }

    await driver.sleep(3000);
  }
}

/**
 * Hàm chạy chính
 */
async function main() {
  let driver, isLoggedIn;
  try {
    driver = await new Builder().forBrowser(Browser.EDGE).build();
    await driver.get(BASE_URL);
    await driver.manage().window().maximize();

    // Kiểm thử form đăng nhập
    isLoggedIn = await testLoginForm(driver);
  } catch (e) {
    console.error("❌ Test failed:", e);
  }

  if (isLoggedIn) {
    console.log("�� Test upload document!");
    await testUploadForm(driver);
  }
}

// Chạy test
main();
