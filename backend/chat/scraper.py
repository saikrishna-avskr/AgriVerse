import requests
from bs4 import BeautifulSoup

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                  "AppleWebKit/537.36 (KHTML, like Gecko) "
                  "Chrome/113.0.0.0 Safari/537.36"
}

def scrape_amazon_price(product_name):
    try:
        query = product_name.replace(" ", "+")
        url = f"https://www.amazon.in/s?k={query}"
        response = requests.get(url, headers=HEADERS, timeout=5)
        soup = BeautifulSoup(response.text, "html.parser")

        # Amazon search result price element (this can change often)
        price_span = soup.find("span", class_="a-price-whole")
        if price_span:
            price = price_span.text.strip().replace(",", "")
            return int(price)
        return None
    except Exception as e:
        print(f"Amazon scrape error: {e}")
        return None

def scrape_flipkart_price(product_name):
    try:
        query = product_name.replace(" ", "%20")
        url = f"https://www.flipkart.com/search?q={query}"
        response = requests.get(url, headers=HEADERS, timeout=5)
        soup = BeautifulSoup(response.text, "html.parser")

        # Flipkart price element (this can also change)
        price_div = soup.find("div", class_="_30jeq3 _1_WHN1")
        if price_div:
            price_text = price_div.text.strip().replace("₹", "").replace(",", "")
            return int(price_text)
        return None
    except Exception as e:
        print(f"Flipkart scrape error: {e}")
        return None

def scrape_prices(product_name):
    prices = {}
    amazon_price = scrape_amazon_price(product_name)
    if amazon_price:
        prices["Amazon"] = amazon_price

    flipkart_price = scrape_flipkart_price(product_name)
    if flipkart_price:
        prices["Flipkart"] = flipkart_price

    return prices
