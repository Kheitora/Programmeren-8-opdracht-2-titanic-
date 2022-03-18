import { DecisionTree } from "./libraries/decisiontree.js"
import { VegaTree } from "./libraries/vegatree.js"

//
// DATA
//
const csvFile = "Data/titanic.csv"
const trainingLabel = "Survived"  
const ignored = ["Cabin", "Embarked", "Fare", "Parch", "Name", "PassengerId", "Pclass", "SibSp", "Ticket"]  
let decisionTree
let accuracy 
let totalAmount
let amountCorrect = 0
let accuracyhtml = document.getElementById("accuracy")
//
// laad csv data als json
//
function loadData() {
    Papa.parse(csvFile, {
        download: true,
        header: true,
        dynamicTyping: true,
        complete: results => trainModel(results.data)   // gebruik deze data om te trainen
        
        
    })
    
}

//
// MACHINE LEARNING - Decision Tree
//
function trainModel(data) {
    // todo : splits data in traindata en testdata
    let trainData = data.slice(0, Math.floor(data.length * 0.8))
    let testData = data.slice(Math.floor(data.length * 0.8) + 1)

    totalAmount = testData.length
    console.log(totalAmount)

    // maak het algoritme aan
    decisionTree = new DecisionTree({
        ignoredAttributes: ignored,
        trainingSet: trainData,
        categoryAttr: trainingLabel
    })

    // Teken de boomstructuur - DOM element, breedte, hoogte, decision tree
    let visual = new VegaTree('#view', 800, 400, decisionTree.toJSON())
    
    // todo : bereken de accuracy met behulp van alle test data
    for(let titanicPassenger of testData) {
        testPassenger(titanicPassenger)

    }

}

function testPassenger(passenger) {
        // kopie van passenger maken, zonder het label
        const passengerWithoutLabel = Object.assign({}, passenger)
        delete passengerWithoutLabel.survived

        // prediction
        let prediction = decisionTree.predict(passengerWithoutLabel)

        // vergelijk de prediction met het echte label
        if (prediction == passenger.Survived) {
            console.log("Deze voorspelling is goed gegaan!")
            amountCorrect++
            accuracy = Math.round(amountCorrect / totalAmount * 100) 
            accuracyhtml.innerText  = `${accuracy}%`
        }else{
            console.log("deze voorspelling is shit")
        }
    }

loadData()