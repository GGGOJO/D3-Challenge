# D3-Challenge
D3 and Census Data: Visualizing and Understanding Health Risks of Americans, 2014

## Step 1: Ceate D3 Charts
I created a static scatter plot between two data variables (Healthcare vs. Poverty) for each state include the District of Columbia. The data were pulled from the data.csv file using the d3.csv function. The states were represented with a circle element. This scalable vector graphic (svg) was coded in the app.js. The scatter plot included aces and labels to the left and bottom of the chart. I used python -m http.server to run the visualization in my html. 

## Step 2: Optional Exploration
I wanted to create interactivity and more charts. Thus, I made more scatter plots with other data variable comparisons (% Obesity, % Smokes, and % Lacks Healthcare in the y-axis) with (% in poverty, Age-median, and Household Income-median in the x-axis) and these scatter plots used click events, so the user can decide which data to display. The scatter plot's circles and axes were animated between chart transitions.

The trick to click event was to bind all the csv data to the circles in the scatter plot. This procedure allows me to easily determin their x or y values when the labels (variables) are clicked.

I also added tool tips using d3-tip.js that provides information when the user hovers over a circle in the scatter plot. 

