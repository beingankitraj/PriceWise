{
  "name": "SavedSearch",
  "type": "object",
  "properties": {
    "query": {
      "type": "string",
      "description": "The search query"
    },
    "category": {
      "type": "string",
      "enum": [
        "products",
        "flights",
        "hotels",
        "trains",
        "travel_packages"
      ],
      "description": "Category of the search"
    },
    "results": {
      "type": "array",
      "description": "Stored search results",
      "items": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string"
          },
          "price": {
            "type": "number"
          },
          "currency": {
            "type": "string"
          },
          "merchant": {
            "type": "string"
          },
          "url": {
            "type": "string"
          },
          "rating": {
            "type": "number"
          },
          "details": {
            "type": "string"
          }
        }
      }
    },
    "last_checked": {
      "type": "string",
      "format": "date-time",
      "description": "When was this search last performed"
    }
  },
  "required": [
    "query",
    "category"
  ]
}