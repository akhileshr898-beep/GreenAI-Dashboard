from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os


# ---------------------------------------------------
# Flask Configuration
# ---------------------------------------------------

app = Flask(
    __name__,
    static_folder=os.path.join(
        os.path.dirname(__file__),
        "../public"
    ),
    static_url_path=""
)

CORS(app)


# ---------------------------------------------------
# AI Model Database
# ---------------------------------------------------

MODELS = {

    "GPT-4": {
        "energy": 250,
        "carbon": 125,
        "accuracy": 98,
        "memory": 32
    },

    "GPT-4o": {
        "energy": 150,
        "carbon": 75,
        "accuracy": 97,
        "memory": 20
    },

    "Llama 3 8B": {
        "energy": 80,
        "carbon": 40,
        "accuracy": 92,
        "memory": 16
    },

    "Mistral 7B": {
        "energy": 60,
        "carbon": 30,
        "accuracy": 90,
        "memory": 14
    },

    "Gemma 2B": {
        "energy": 25,
        "carbon": 12,
        "accuracy": 86,
        "memory": 4
    },

    "Phi-3 Mini": {
        "energy": 15,
        "carbon": 7,
        "accuracy": 84,
        "memory": 4
    }

}



# ---------------------------------------------------
# Home Page
# ---------------------------------------------------

@app.route("/")
def home():

    return send_from_directory(
        app.static_folder,
        "index.html"
    )



# ---------------------------------------------------
# Static Files
# ---------------------------------------------------

@app.route("/<path:path>")
def static_files(path):

    return send_from_directory(
        app.static_folder,
        path
    )



# ---------------------------------------------------
# Get AI Models API
# ---------------------------------------------------

@app.route("/api/models", methods=["GET"])
def get_models():

    result = []


    for name, info in MODELS.items():

        green_score = max(
            10,
            round(100 - info["carbon"] / 20)
        )


        result.append({

            "model": name,
            "energy": info["energy"],
            "carbon": info["carbon"],
            "accuracy": info["accuracy"],
            "memory": info["memory"],
            "green_score": green_score

        })


    return jsonify(result)




# ---------------------------------------------------
# Country & Energy Source Factors
# ---------------------------------------------------

COUNTRY_FACTOR = {

    "India": 1.00,
    "USA": 0.80,
    "Germany": 0.50,
    "Norway": 0.12,
    "China": 1.10

}



SOURCE_FACTOR = {

    "Coal": 1.40,
    "Solar": 0.20,
    "Wind": 0.10,
    "Hydro": 0.08,
    "Nuclear": 0.15

}




# ---------------------------------------------------
# Prediction API
# ---------------------------------------------------

@app.route("/api/predict", methods=["POST"])
def predict():

    data = request.get_json()


    model = data["model"]
    runs = int(data["runs"])
    country = data["country"]
    source = data["source"]
    task = data["task"]


    info = MODELS[model]


    country_factor = COUNTRY_FACTOR[country]
    source_factor = SOURCE_FACTOR[source]


    energy = info["energy"] * runs


    carbon = info["carbon"] * runs

    carbon = round(
        carbon *
        country_factor *
        source_factor
    )


    electricity_price = 8

    cost = (
        energy / 1000
    ) * electricity_price



    green_score = max(
        10,
        round(100 - carbon / 20)
    )



    if task == "Code Generation":

        recommendation = "GPT-4o"


    elif task == "Translation":

        recommendation = "Gemma 2B"


    elif task == "Image Analysis":

        recommendation = "Llama 3 8B"


    else:

        recommendation = "Phi-3 Mini"



    return jsonify({

        "model": model,
        "runs": runs,
        "country": country,
        "source": source,
        "task": task,
        "energy": energy,
        "carbon": carbon,
        "cost": round(cost,2),
        "green_score": green_score,
        "accuracy": info["accuracy"],
        "memory": info["memory"],
        "recommendation": recommendation

    })




# ---------------------------------------------------
# Local Development
# ---------------------------------------------------

if __name__ == "__main__":

    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )