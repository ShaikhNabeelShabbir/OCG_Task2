import { promises as fs } from "fs";
import * as fsSync from "fs";

async function fetchDATA(url: string, name: string) {
  console.log("Fetching data");
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Data not found");
    }
    const data = await response.json();
    //console.log(data); // Process the data as needed
    const JData = JSON.stringify(data);
    await JSON_File_Creator(JData, name);
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

const JSON_File_Creator = async (
  json_string: string,
  name: string
): Promise<void> => {
  console.log("Creating JSON file");
  // Check if file already exists
  try {
    await fs.writeFile(`${name}.json`, json_string);
    console.log("Data written to file");
  } catch (err) {
    console.error("Error writing file", err);
  }
};

//ask about any and file types that
const firstTen = async (file: any) => {
  console.log("Fetching first 10 records");
  try {
    const fileContent = await fs.readFile(file, "utf8");
    const data = JSON.parse(fileContent);
    var top10 = data.slice(0, 10);
    console.log(top10);
  } catch (err) {
    console.error("Error reading or parsing file", err);
  }
  return top10;
};

const parsingJSON = async (top10: Array<string>) => {
  let result: { [key: string]: number } = {};
  try {
    // Read the JSON file
    const data = fsSync.readFileSync("coingecko_vs_currencies.json");

    // Parse the JSON file
    const obj = JSON.parse(data.toString());
    const list = obj.rates;
    //console.log(list);
    //Iterate over the JSON object
    for (let index = 0; index < top10.length; index++) {
      const element = top10[index];
      if (element in list) {
        const x = 1 / list[element].value;
        console.log(`${element}: ${x} bitcoin`);
        result[element] = x;
      } else {
        console.log("Not Happen");
      }
    }
  } catch (err) {
    console.error("Error reading or parsing file", err);
  }
  // for (var key in result) {
  //   console.log(key + " : " + result[key]);
  // }
  const jResult = JSON.stringify(result, null, 2);
  JSON_File_Creator(jResult, "result");
};

// Main function to fetch data and process it
async function main() {
  await fetchDATA(
    "https://api.coingecko.com/api/v3/simple/supported_vs_currencies",
    "supported_vs_currencies"
  );
  const top10 = await firstTen("supported_vs_currencies.json");

  await fetchDATA(
    "https://api.coingecko.com/api/v3/exchange_rates",
    "coingecko_vs_currencies"
  );

  parsingJSON(top10);
}
main();
