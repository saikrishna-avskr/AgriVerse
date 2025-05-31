import requests
from bs4 import BeautifulSoup

# Define HTTP headers to mimic a real browser request
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                  "AppleWebKit/537.36 (KHTML, like Gecko) "
                  "Chrome/113.0.0.0 Safari/537.36"
}

def scrape_amazon_price(product_name):
    """
    Scrapes the price of a product from Amazon India search results.

    Args:
        product_name (str): The name of the product to search for.

    Returns:
        int or None: The price if found, otherwise None.
    """
    try:
        # Prepare the search query for the URL
        query = product_name.replace(" ", "+")
        url = f"https://www.amazon.in/s?k={query}"
        # Send GET request to Amazon with headers
        response = requests.get(url, headers=HEADERS, timeout=5)
        # Parse the HTML response
        soup = BeautifulSoup(response.text, "html.parser")

        # Find the first price element in the search results
        price_span = soup.find("span", class_="a-price-whole")
        if price_span:
            # Clean and convert the price to integer
            price = price_span.text.strip().replace(",", "")
            return int(price)
        return None
    except Exception as e:
        print(f"Amazon scrape error: {e}")
        return None

def scrape_flipkart_price(product_name):
    """
    Scrapes the price of a product from Flipkart search results.

    Args:
        product_name (str): The name of the product to search for.

    Returns:
        int or None: The price if found, otherwise None.
    """
    try:
        # Prepare the search query for the URL
        query = product_name.replace(" ", "%20")
        url = f"https://www.flipkart.com/search?q={query}"
        # Send GET request to Flipkart with headers
        response = requests.get(url, headers=HEADERS, timeout=5)
        # Parse the HTML response
        soup = BeautifulSoup(response.text, "html.parser")

        # Find the first price element in the search results
        price_div = soup.find("div", class_="_30jeq3 _1_WHN1")
        if price_div:
            # Clean and convert the price to integer
            price_text = price_div.text.strip().replace("₹", "").replace(",", "")
            return int(price_text)
        return None
    except Exception as e:
        print(f"Flipkart scrape error: {e}")
        return None

def scrape_prices(product_name):
    """
    Scrapes prices for a product from both Amazon and Flipkart.

    Args:
        product_name (str): The name of the product to search for.

    Returns:
        dict: A dictionary with site names as keys and prices as values.
    """
    prices = {}
    # Scrape price from Amazon
    amazon_price = scrape_amazon_price(product_name)
    if amazon_price:
        prices["Amazon"] = amazon_price

    # Scrape price from Flipkart
    flipkart_price = scrape_flipkart_price(product_name)
    if flipkart_price:
        prices["Flipkart"] = flipkart_price

    return prices
