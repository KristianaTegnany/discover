import React, { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Text, View } from "./Themed";
import { ListItem } from "react-native-elements";
import { Checkbox } from "react-native-paper";
import { Icon } from "react-native-elements";
import RadioItem from './RadioItem';

export function Badge({ value, marginTop, success } : { value: string, marginTop?: number, success: boolean }){
    return (
      <View
        style={{
          backgroundColor:
            value === "TakeAway"
              ? "#303AA2"
              : value === "Delivery"
              ? "#621676"
              : success? 'white' : "#F54F4F",
          borderRadius: 10,
          height: 20,
          width: 87,
          borderWidth: success? 1 : 0,
          borderColor: 'green',
          marginTop: marginTop || 0,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            paddingHorizontal: 10,
            fontSize: 10,
            fontFamily: "geometria-bold",
            color: success? 'green' : "white",
          }}
        >
          {value}
        </Text>
      </View>
    );
  };

export function LineItem({ line, index, children, engagModeResa, selectedPricevarIndexes, setSelectedPricevarIndexes, onPress, checkMessFormula, checkMessPerso, addQuantityFromLines, removeQuantityFromLines, deleteFromLines }: { line: any, index: number, children?: any, engagModeResa: string | undefined, selectedPricevarIndexes: { id: string, index: number }[], setSelectedPricevarIndexes:  (val: { id: string, index: number}[]) => void, onPress?: () => void, checkMessFormula: (index: number) => string[], checkMessPerso: (index: number) => string[], addQuantityFromLines: (index: number) => void, removeQuantityFromLines: (index: number) => void, deleteFromLines: (index: number) => void }){
    const formulaErrors = checkMessFormula(index),
          persoErrors = checkMessPerso(index)
    const [, update] = useState<{}>()

    return (
      <View>
        <ListItem bottomDivider onPress={onPress} containerStyle={styles.containerStyle}>
            <Text style={styles.defaultFamilyBold}>
                {line.name}    x {line.quantity || 0}
            </Text>
            <ScrollView
                contentContainerStyle={styles.pricevarContainer}
                showsHorizontalScrollIndicator={false}
            >
            {
                line.pricevarcheck && line.pricevars && line.pricevars.length > 0 && line.pricevars.map((pricevar: any, i: number) => {
                    const index = selectedPricevarIndexes.length > 0? selectedPricevarIndexes.findIndex((selectedPricevar: any) => selectedPricevar.id === line.id) : -1
                    return (
                        <RadioItem key={i} checked={selectedPricevarIndexes.length > 0? (selectedPricevarIndexes[index].id === line.id && selectedPricevarIndexes[index].index === i)  : false} setChecked={() => {
                            let newSelectedPricevarIndexes = selectedPricevarIndexes
                            if(index === -1)
                                newSelectedPricevarIndexes.push({id: line.id, index: i})
                            else
                                newSelectedPricevarIndexes[index] = {id: line.id, index: i}
                            setSelectedPricevarIndexes(newSelectedPricevarIndexes)
                            update({})
                        }} title={pricevar.name + ' ' + (engagModeResa? (engagModeResa === 'Delivery'? (pricevar.pricevardelivery || 0) : engagModeResa === 'TakeAway'? (pricevar.pricevartakeaway || 0) : (pricevar.pricevaronsite || 0)) + '€' : '')} />
                    )
                })
            }
            </ScrollView>
          <ListItem containerStyle={styles.containerStyle2}>
            <ListItem.Content>
              {((line.formulaChoice && line.formulaChoice.length > 0) ||
                (line.persoData && line.persoData.length > 0)) && (
                <View
                  style={styles.marginTop5}
                >
                  {line.formulaChoice && line.formulaChoice.length > 0 && (
                    <Badge success={formulaErrors.length === 0} value="Formule" />
                  )}
                  {line.persoData && line.persoData.length > 0 && (
                    <Badge success={persoErrors.length === 0} marginTop={line.formulaChoice && line.formulaChoice.length > 0? 5 : 0} value="Perso" />
                  )}
                </View>
              )}
            </ListItem.Content>
            <Text
              style={styles.lineTitle}
            >
              {line.pricevarcheck && line.pricevars && line.pricevars.length > 0? '~' : (parseFloat(line.amount || 0).toFixed(2)+'€')}
            </Text>
            <Icon
              name="add"
              size={20}
              color={"grey"} 
              tvParallaxProperties={undefined}
              onPress={() => addQuantityFromLines(index)}
            /> 
            <Icon
              name="remove"
              size={20}
              color={"grey"}
              tvParallaxProperties={undefined}
              onPress={() => removeQuantityFromLines(index)}
            />
            <Icon
              name="delete"
              size={20}
              color={"grey"}
              tvParallaxProperties={undefined}
              onPress={() => {
                deleteFromLines(index);
              }}
            />
          </ListItem>
          {
            formulaErrors?.length > 0 && formulaErrors.map((textCheckFormula, i) => (
              <Text key={i} style={styles.errorText} >{textCheckFormula}</Text>
            ))
          }
          {
            persoErrors?.length > 0 && persoErrors.map((textCheckPerso, i) => (
              <Text key={i} style={styles.errorText} >{textCheckPerso}</Text>
            ))
          }
        </ListItem>
        {children}
      </View>
    );
  };


  export function LineItemCollapse({ line, index, engagModeResa, selectedPricevarIndexes, setSelectedPricevarIndexes, expanded, setExpanded, checkMessFormula, checkMessPerso, addQuantityFromLines, removeQuantityFromLines, deleteFromLines, addFormulaMenuChoice, removeFormulaMenuChoice, updatePersoNumChecked } : { line: any, index: number, engagModeResa: string | undefined, selectedPricevarIndexes: { id: string, index: number }[], setSelectedPricevarIndexes: (val: { id: string, index: number}[]) => void, expanded: number, setExpanded: (index: number) => void,  checkMessFormula: (index: number) => string[], checkMessPerso: (index: number) => string[], addQuantityFromLines: (index: number) => void, removeQuantityFromLines: (index: number) => void, deleteFromLines: (index: number) => void, addFormulaMenuChoice: (index: number, i:number, j: number) => void, removeFormulaMenuChoice: (index: number, i:number, j: number) => void, updatePersoNumChecked: (index: number, i:number, j: number) => void }){
    return (
      <LineItem
        onPress={() => 
          setExpanded(expanded !== index? index: -1)
        }
        line={line}
        index={index}
        engagModeResa={engagModeResa}
        selectedPricevarIndexes={selectedPricevarIndexes}
        setSelectedPricevarIndexes={setSelectedPricevarIndexes}
        checkMessFormula={checkMessFormula}
        checkMessPerso={checkMessPerso}
        addQuantityFromLines={addQuantityFromLines}
        removeQuantityFromLines={removeQuantityFromLines}
        deleteFromLines={deleteFromLines}
      >
        {(expanded === index &&
          line.formulaChoice) && line.formulaChoice.map((cat: any, i: number) => {
            return cat.menus.map((menu: any, j: number) => (
              <View key={i+ '' + j}>
                {
                  j === 0 &&
                  <ListItem containerStyle={styles.containerStyle3} key={"titre"+ i} bottomDivider>
                    <Text
                      style={styles.choixText}
                    >
                      Choix {cat.cattitle} : {cat.numExact}
                    </Text>
                  </ListItem> 
                }
                <ListItem bottomDivider>
                  <ListItem.Content>
                    <Text
                      style={styles.menuText}
                    >
                      {menu.title}{' '}
                    </Text>
                  </ListItem.Content>
                  <Text
                    style={styles.numChoicedText}
                  >
                    x {menu.numChoiced || 0}
                  </Text>
                  <Icon
                    name="add"
                    size={20}
                    color={"grey"}
                    tvParallaxProperties={undefined}
                    onPress={() => addFormulaMenuChoice(index, i, j)}
                  />
                  <Icon
                    name="remove"
                    size={20}
                    color={"grey"}
                    tvParallaxProperties={undefined}
                    onPress={() => removeFormulaMenuChoice(index, i, j)}
                  />
                </ListItem>
              </View>
            ));
          })}
        {(expanded === index &&
          line.persoData) && line.persoData.map((perso: any, i: number) => {
            return (
              <View key={'perso'+i}>
                <ListItem containerStyle={{padding: 5, justifyContent: 'center'}} key={"titre"+ i} bottomDivider>
                  <Text
                    style={styles.persoNameText}
                  >
                    Choisissez {perso.name} {perso.mandatory && " Obligatoire"}
                  </Text>
                </ListItem> 
                <ListItem bottomDivider>
                  <ListItem.Content>
                    {
                      perso.values.length > 0 &&
                        <View
                          style={styles.marginTop5}
                        >
                          {perso.values.map((value: any, j: number) => (
                            <View key={'perso'+i+''+j} style={{flexDirection: 'row', alignItems: 'center'}}>
                              <Checkbox.Android
                                onPress={() => updatePersoNumChecked(index, i, j)}
                                color="#F50F50"
                                status={value.checked ? "checked" : "unchecked"}
                              />
                              <Text>{value.value} {(value.price || 0).toFixed(2)}€</Text>
                            </View>
                          ))}
                        </View>
                    }
                  </ListItem.Content>
                  <Text
                    style={styles.persoMaxText}
                  >
                    {perso.max} maximum gratuit
                  </Text>
                  <Text
                    style={styles.persoMaxpaidText}
                  >
                    {perso.maxpaid} maximum payant
                  </Text>
                </ListItem>
              </View>
            )
          })}
      </LineItem>
    );
  };

const styles = StyleSheet.create({
    containerStyle: { flexDirection: 'column', width:'100%', borderTopWidth: 0.5 },
    containerStyle2: { width:'100%', paddingTop: 0 },
    containerStyle3: { padding: 5, justifyContent: 'center' },
    lineTitle: {
        marginTop: 5,
        fontSize: 14,
        fontFamily: "geometria-regular"
    },
    lineTitleBold: {
        marginTop: 5,
        fontSize: 14,
        fontFamily: "geometria-bold"
    },
    errorText: { fontFamily: "geometria-bold", color:'#ff5050', fontSize: 12, marginTop:5, width: '100%' },
    defaultFamilyBold: { fontFamily: "geometria-bold", marginBottom: 10 },
    pricevarContainer: {
        borderTopColor: "#e3e6f0",
        paddingHorizontal: 20,
        width: "100%",
        flexDirection: 'row'
    },
    choixText: {
        fontSize: 12,
        fontFamily: "geometria-bold",
        color: '#f6c23e'
    },
    menuText: {
        fontSize: 14,
        paddingLeft: 20,
        fontFamily: "geometria-regular",
    },
    numChoicedText: {
        fontSize: 14,
        width: 35,
        fontFamily: "geometria-regular",
    },
    persoNameText: {
        fontSize: 12,
        fontFamily: "geometria-bold",
        color: '#f6c23e'
    },
    persoMaxText: {
        fontSize: 12,
        width: 60,
        textAlign: 'center',
        fontFamily: "geometria-regular",
    },
    persoMaxpaidText: {
        fontSize: 12,
        width: 60,
        textAlign: 'center',
        fontFamily: "geometria-regular",
    },
    marginTop5: {
        marginTop: 5
    }
})