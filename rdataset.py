import pandas as pd

# Step 1: Load the dataset
# Replace 'your_file.xlsx' with the path to your Excel file
file_path = 'C:\\Users\\HP\\OneDrive\\Desktop\\Sih 123\\Book2.xlsx'
data = pd.read_excel(file_path)

# Step 2: Extract columns for yearly average rainfall
rainfall_mean_columns = [
    col for col in data.columns if "udel_precip_v501_sum" in col and ".mean" in col
]

# Create a new DataFrame with Year and Average Rainfall
rainfall_data = pd.DataFrame({
    "Year": [int(col.split('.')[1]) for col in rainfall_mean_columns],  # Extract year from column names
    "Average_Rainfall": data.iloc[0][rainfall_mean_columns].values     # Extract values for the first row
})

# Step 3: Clean the data
# Convert the "Average_Rainfall" column to numeric (in case of errors)
rainfall_data["Average_Rainfall"] = pd.to_numeric(rainfall_data["Average_Rainfall"], errors="coerce")
rainfall_data = rainfall_data.dropna()  # Remove rows with missing values

# Step 4: Save the prepared dataset to a CSV file
output_file = "average_rainfall_1900_2020.csv"
rainfall_data.to_csv(output_file, index=False)

# Display the first few rows of the prepared dataset
print("Prepared Dataset:")
print(rainfall_data.head())

print(f"\nDataset saved as '{output_file}'")
