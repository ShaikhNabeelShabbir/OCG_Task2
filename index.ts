import { promises as fs } from "fs";

async function fetchData(url: string, fileName: string) {
  console.log("Fetching data");
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Data not found");
    }
    const data = await response.json();
    const jsonData = JSON.stringify(data);
    await createJsonFile(jsonData, fileName);
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

const createJsonFile = async (jsonString: string, fileName: string) => {
  console.log("Creating JSON file");
  try {
    await fs.writeFile(`${fileName}.json`, jsonString);
    console.log("Data written to file");
  } catch (err) {
    console.error("Error writing file", err);
  }
};

const getFirstTenRecords = async (file: any) => {
  console.log("Fetching first 10 records");
  try {
    const fileContent = await fs.readFile(file, "utf8");
    const data = JSON.parse(fileContent);
    const topTen = data.slice(0, 10);
    console.log(topTen);
    return topTen;
  } catch (err) {
    console.error("Error reading or parsing file", err);
    return [];
  }
};

const parseJson = async (topTen: Array<string>) => {
  let result: { [key: string]: number } = {};
  try {
    const data = await fs.readFile("coingecko_vs_currencies.json", "utf8");
    const obj = JSON.parse(data.toString());
    const list = obj.rates;
    for (let index = 0; index < topTen.length; index++) {
      const element = topTen[index];
      if (element in list) {
        const x = 1 / list[element].value;
        console.log(`${element}: ${x} bitcoin`);
        result[element] = x;
      } else {
        console.log("Not Found");
      }
    }
  } catch (err) {
    console.error("Error reading or parsing file", err);
  }
  const jsonResult = JSON.stringify(result, null, 2);
  createJsonFile(jsonResult, "result");
};

async function main() {
  await fetchData(
    "https://api.coingecko.com/api/v3/simple/supported_vs_currencies",
    "supported_vs_currencies"
  );
  const topTen = await getFirstTenRecords("supported_vs_currencies.json");

  await fetchData(
    "https://api.coingecko.com/api/v3/exchange_rates",
    "coingecko_vs_currencies"
  );

  await parseJson(topTen);
}

main();
