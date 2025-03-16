import { By, Builder, until, Select, Browser } from 'selenium-webdriver';
import assert from 'assert';

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
        { username: "", password: "", expectedError: "Yêu cầu nhập tên đăng nhập và mật khẩu." },
        { username: "", password: "wrongpass", expectedError: "Yêu cầu nhập tên đăng nhập và mật khẩu." },
        { username: "user@#$%", password: "", expectedError: "Yêu cầu nhập tên đăng nhập và mật khẩu." },
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

        await driver.sleep(1000);
        await inputField(usernameInput, test.username);
        await driver.sleep(500);
        await inputField(passwordInput, test.password);
        await loginButton.click();

        await driver.sleep(500); // Chờ xử lý validation

        let errorMessageElement = await driver.findElement(By.css(".alert"));
        let actualErrorMessage = await errorMessageElement.getText();

        if (await isRequired(usernameInput) && test.username === '') {
            assert.strictEqual(actualErrorMessage, test.expectedError, `❌ Expected "${test.expectedError}", but got "${actualErrorMessage}"`);
            console.log(`✅ Passed: ${actualErrorMessage}`);
            continue;
        }

        if (await isRequired(passwordInput) && test.password === '') {
            assert.strictEqual(actualErrorMessage, test.expectedError, `❌ Expected "${test.expectedError}", but got "${actualErrorMessage}"`);
            console.log(`✅ Passed: ${actualErrorMessage}`);    
            continue;
        }

        try {
            let errorElement = await driver.wait(
                until.elementLocated(
                    By.xpath('//*[@id="app-content"]/div/form/div[4]/div'),
                    3000
                )
            );
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
    // Chờ đến trang upload
    await driver.wait(until.elementLocated(
        By.xpath('//*[@id="app"]/div/div[1]/div/div/div[3]/div/div[1]/li/a/button')),
        10000
    ).click();

    // Test cases
    const testCases = [
        // Missing title
        // { title: "", category: 1, filename: "F:\\Nam4\\ChuyenDeCNPM\\TestingSoftware\\public\\file_test\\document.pdf", description: "No title test", expectedError: "Vui lòng điền đầy đủ thông tin." },

        // // Missing category
        // { title: "No Category", category: null, filename: "F:\\Nam4\\ChuyenDeCNPM\\TestingSoftware\\public\\file_test\\document.pdf", description: "No category test", expectedError: "Vui lòng điền đầy đủ thông tin." },

        // // Missing file
        // { title: "No File", category: 1, filename: "", description: "No file selected", expectedError: "Vui lòng điền đầy đủ thông tin." },

        // // Missing description
        // // { title: "No Description", category: 1, filename: "F:\\Nam4\\ChuyenDeCNPM\\TestingSoftware\\public\\file_test\\document.pdf", description: "", expectedError: "Tài liệu đã được upload thành công!" },

        
        // { title: "Invalid File", category: 1, filename: "F:\\Nam4\\ChuyenDeCNPM\\TestingSoftware\\public\\file_test\\toolbox-installer-HdzdVevku9km_fZhvAmrcQ.exe", description: "", expectedError: "Chỉ cho phép upload file PDF." },
        
        // // File in an unsupported format (e.g., .jpg)
        // { title: "Invalid Image File", category: 1, filename: "F:\\Nam4\\ChuyenDeCNPM\\TestingSoftware\\public\\file_test\\image.jpg", description: "Image file test", expectedError: "Chỉ cho phép upload file PDF." },

        // // File in an unsupported format (e.g., .docx)
        // { title: "Invalid Word File", category: 1, filename: "F:\\Nam4\\ChuyenDeCNPM\\TestingSoftware\\public\\file_test\\document.docx", description: "Word file test", expectedError: "Chỉ cho phép upload file PDF." },

        // File without an extension
        { title: "No Extension", category: 1, filename: "F:\\Nam4\\ChuyenDeCNPM\\TestingSoftware\\public\\file_test\\file_without_extension", description: "No extension test", expectedError: "Chỉ cho phép upload file PDF." },
        
        { title: "Valid PDF", category: 1, filename: "F:\\Nam4\\ChuyenDeCNPM\\TestingSoftware\\public\\file_test\\document.pdf", description: "Test upload PDF", expectedError: "Tài liệu đã được upload thành công!" },
        // Special characters in title
        { title: "Title@#$%^&*", category: 1, filename: "F:\\Nam4\\ChuyenDeCNPM\\TestingSoftware\\public\\file_test\\document.pdf", description: "Special characters in title", expectedError: "Tài liệu đã được upload thành công!" },
        // File with uppercase extension
        { title: "Uppercase Extension", category: 1, filename: "F:\\Nam4\\ChuyenDeCNPM\\TestingSoftware\\public\\file_test\\document.pdf", description: "Uppercase extension test", expectedError: "Tài liệu đã được upload thành công!" },

        // Upload same file twice
        { title: "Duplicate Upload", category: 1, filename: "F:\\Nam4\\ChuyenDeCNPM\\TestingSoftware\\public\\file_test\\document.pdf", description: "Upload same file twice", expectedError: "Tài liệu đã được upload thành công!" },

        // Title too long
        // { title: "a".repeat(300), category: 1, filename: "D:\\Downloads\\document.pdf", description: "Long title test", expectedError: "Tiêu đề quá dài." }
    ];
    // Locate form elements  
    let titleInput = await driver.wait(until.elementLocated(By.id("title")), 5000);
    let categoryDropdown = await driver.findElement(By.id("categories"));
    let fileInput = await driver.findElement(By.id("formFile"));
    let descriptionInput = await driver.findElement(By.xpath('//*[@id="app-content"]/div/div[2]/div/form/div/div[4]/textarea'));
    let submitButton = await driver.findElement(By.xpath('//*[@id="app-content"]/div/div[2]/div/form/div/div[5]/button'));
   
    for (let test of testCases) {
        await driver.sleep(2000);
        console.log(`🔄 Testing file: "${test.filename}"`);

        // Cuộn đến phần tử để đảm bảo nó nằm trong khung nhìn
        await driver.executeScript("arguments[0].scrollIntoView(true);", submitButton);

        await driver.sleep(500);
        await titleInput.clear();
        await descriptionInput.clear();
        // Nhập thông tin
        await titleInput.sendKeys(test.title);
        // Nhập mô tả  
        await driver.executeScript("arguments[0].value = '';", descriptionInput);
        await descriptionInput.sendKeys(test.description);

        // Nhấn submit
        await submitButton.click();
        await driver.sleep(1000); // Chờ xác nhận

        let messageElement = await driver.findElement(By.css(".alert"));
        let actualErrorMessage = await messageElement.getText();

        if (await isRequired(titleInput) && test.title === '') {
            assert.strictEqual(actualErrorMessage, test.expectedError, `❌ Expected "${test.expectedError}", but got "${actualErrorMessage}"`);
            console.log("✅ Passed: Tiêu đề không được để trống.");
            continue;
        }

        if (test.category === null || test.category === undefined) {
            assert.strictEqual(actualErrorMessage, test.expectedError, `❌ Expected "${test.expectedError}", but got "${actualErrorMessage}"`);
            console.log("✅ Passed: Vui lòng chọn danh mục.");
            continue;
        }

        // Chọn danh mục  
        let categoryOption = await categoryDropdown.findElement(By.css(`option[value='${test.category}']`));
        await categoryOption.click();

        if (test.filename === undefined || test.filename === '' || test.filename === null) {
            assert.strictEqual(actualErrorMessage, test.expectedError, `❌ Expected "${test.expectedError}", but got "${actualErrorMessage}"`);
            console.log("✅ Passed: Vui lòng chọn file để upload.");
            continue;
        }

        // Xử lý upload file  
        try {
            await fileInput.sendKeys(test.filename);
        } catch (error) {
            console.error(`❌ Failed to upload file: ${error.message}`);
            continue;
        }
        await driver.sleep(10000);

        try {
            console.log("🔍 Kiểm tra alert...");
            
            // Chờ alert xuất hiện tối đa 5 giây
            await driver.wait(until.alertIsPresent(), 5000);
            
            let alert = await driver.switchTo().alert();
            let alertText = await alert.getText();
            console.log(`⚠️ Alert xuất hiện: "${alertText}"`);
        
            // Kiểm tra nội dung alert
            assert.strictEqual(alertText, test.expectedError, `❌ Expected "${test.expectedError}", but got "${alertText}"`);
            await alert.accept();
            console.log(`✅ Passed: ${test.expectedError}`);
        
            // Nếu có alert thì bỏ qua các bước tiếp theo
            continue;
        } catch (error) {
            console.log("⚠️ Không có alert xuất hiện, tiếp tục kiểm tra thông báo lỗi trong trang.");
        }
        
        // Kiểm tra thông báo thành công
        try {
            let successMessage = await driver.wait(
                until.elementLocated(By.xpath('//*[@id="app-content"]/div/div[3]/div/p')),
                // until.elementLocated(By.css(".alert")),
                2000
            );
            let successText = await successMessage.getText();
            assert.strictEqual(successText, test.expectedError, `❌ Expected "${test.expectedError}", but got "${successText}"`);
            console.log(`✅ Passed: ${test.expectedError}`);

            // Nếu thành công, đóng modal
            let modal = await driver.findElement(By.xpath('//*[@id="app-content"]/div/div[3]'));
            if (await modal.isDisplayed()) {
                // 📌 Kiểm tra nếu là phần tử cuối cùng thì trở về trang Home
                if (testCases.indexOf(test) === testCases.length - 1) {
                    await driver.wait(
                        until.elementLocated(By.xpath('//*[@id="app-content"]/div/div[3]/div/div/a/button')),
                        1500
                    ).click();
                }

                await driver.wait(
                    until.elementLocated(By.xpath('//*[@id="app-content"]/div/div[3]/div/div/button')),
                    1500
                ).click();
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

    await driver.sleep(5000);

    if (isLoggedIn) {
        console.log("🔄 Test upload document!");
        await testUploadForm(driver);
    }
}

// Chạy test
main();
