import React, { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Text, useThemeColor, View } from "./Themed";
import { ListItem } from "react-native-elements";
import { Checkbox } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import RadioItem from './RadioItem';

export function LineItem({ line, index, alacarte, freeconfirm, children, engagModeResa, selectedPricevarIndexes, setSelectedPricevarIndexes, addQuantityFromLines, removeQuantityFromLines }: { line: any, index: number, alacarte: boolean, freeconfirm: boolean, children?: any, engagModeResa: string | undefined, selectedPricevarIndexes: { id: string, index: number }[], setSelectedPricevarIndexes:  (val: { id: string, index: number}[]) => void, addQuantityFromLines: (index: number) => void, removeQuantityFromLines: (index: number) => void }){
  const color = useThemeColor({ light: 'black', dark: 'white' }, "text");
  const backgroundColor = useThemeColor({ light: 'white', dark: 'black' }, "background");

  const [, update] = useState<{}>()
  return (
    <View>
      <ListItem bottomDivider containerStyle={[styles.containerStyle, { backgroundColor }]}>
        <ListItem containerStyle={[styles.containerStyle2, { backgroundColor }]}>
          <ListItem.Content>
            <Text style={styles.defaultFamilyBold}>
                {line.name}
            </Text>
            {
              alacarte &&
              <Text
                style={styles.lineTitle}
              >
                {line.pricevarcheck && line.pricevars && line.pricevars.length > 0? '~' : (parseFloat(line.amount || 0).toFixed(2)+'€')}
              </Text>
            }
          </ListItem.Content>
          {
            alacarte &&
            <>
              <Ionicons
                name="remove-circle"
                style={styles.searchIcon}
                onPress={() =>
                  removeQuantityFromLines(index)
                }
              />
              <ListItem.Subtitle
                style={[styles.menuChoiceText, { color }]}
              >
                {line.quantity || 0}
              </ListItem.Subtitle>
              <Ionicons
                name="add-circle"
                style={styles.searchIcon}
                onPress={() =>
                  addQuantityFromLines(index)
                }
              />
            </>
          }
        </ListItem>
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
      </ListItem>
      {children}
    </View>
  );
};


  export function LineItemCollapse({ line, index, alacarte, freeconfirm, engagModeResa, selectedPricevarIndexes, setSelectedPricevarIndexes, checkMessFormula, checkMessPerso, addQuantityFromLines, removeQuantityFromLines, addFormulaMenuChoice, removeFormulaMenuChoice, updatePersoNumChecked } : { line: any, index: number, alacarte: boolean, freeconfirm: boolean, engagModeResa: string | undefined, selectedPricevarIndexes: { id: string, index: number }[], setSelectedPricevarIndexes: (val: { id: string, index: number}[]) => void, checkMessFormula: (index: number) => string[], checkMessPerso: (index: number) => string[], addQuantityFromLines: (index: number) => void, removeQuantityFromLines: (index: number) => void, addFormulaMenuChoice: (index: number, i:number, j: number) => void, removeFormulaMenuChoice: (index: number, i:number, j: number) => void, updatePersoNumChecked: (index: number, i:number, j: number) => void }){
    const color = useThemeColor({ light: 'black', dark: 'white' }, "text");
    const backgroundColor = useThemeColor({ light: 'white', dark: 'black' }, "background");
    const formulaErrors = checkMessFormula(index),
          persoErrors = checkMessPerso(index)
    
    return (
      <LineItem
        line={line}
        index={index}
        alacarte={alacarte}
        freeconfirm={freeconfirm}
        engagModeResa={engagModeResa}
        selectedPricevarIndexes={selectedPricevarIndexes}
        setSelectedPricevarIndexes={setSelectedPricevarIndexes}
        addQuantityFromLines={addQuantityFromLines}
        removeQuantityFromLines={removeQuantityFromLines}
      >
        {
          line.formulaChoice && line.formulaChoice.map((cat: any, i: number) => {
            return cat.menus.map((menu: any, j: number) => (
              <View key={i+ '' + j}>
                {
                  j === 0 &&
                  <ListItem containerStyle={styles.containerStyle3} key={"titre"+ i} bottomDivider>
                    {
                      alacarte && formulaErrors?.length > 0 && formulaErrors[i] !== '' &&
                        <Text key={i} style={styles.errorText} >{formulaErrors[i]}</Text>
                    }
                    {
                      (!alacarte || (formulaErrors?.length === 0 || formulaErrors[i] === '')) &&
                      <Text
                        style={styles.choixText}
                      >
                        {cat.cattitle}
                      </Text>
                    }
                  </ListItem> 
                }
                <ListItem bottomDivider containerStyle={{ backgroundColor }}>
                  <ListItem.Content>
                    <Text
                      style={styles.menuText}
                    >
                      {menu.title}{' '}
                    </Text>
                  </ListItem.Content>
                  {
                    alacarte &&
                    <>
                      <Ionicons
                        name="remove-circle"
                        style={styles.searchIcon}
                        onPress={() =>
                          removeFormulaMenuChoice(index, i, j)
                        }
                      />
                      <ListItem.Subtitle
                        style={[styles.menuChoiceText, { color }]}
                      >
                        {menu.numChoiced || 0}
                      </ListItem.Subtitle>
                      <Ionicons
                        name="add-circle"
                        style={styles.searchIcon}
                        onPress={() =>
                          addFormulaMenuChoice(index, i, j)
                        }
                      />
                    </>
                  }                
                </ListItem>
              </View>
            ));
          })}
        {
          line.persoData && line.persoData.map((perso: any, i: number) => {
            return (
              <View key={'perso'+i}>
                <ListItem containerStyle={{ padding: 5, justifyContent: 'center' }} key={"titre"+ i} bottomDivider>
                  {
                    alacarte && persoErrors?.length > 0 && persoErrors[i] !== '' &&
                      <Text key={i} style={styles.errorText} >{persoErrors[i]}</Text>
                  }
                  {
                    (!alacarte || (persoErrors?.length === 0 || persoErrors[i] === '')) &&
                    <Text
                      style={styles.persoNameText}
                    >
                      {perso.name}
                    </Text>
                  }
                </ListItem> 
                <ListItem bottomDivider containerStyle={{ backgroundColor }}>
                  <ListItem.Content>
                    {
                      perso.values.length > 0 &&
                        <View
                          style={styles.marginTop5}
                        >
                          {perso.values.map((value: any, j: number) => (
                            <View key={'perso'+i+''+j} style={{flexDirection: 'row', alignItems: 'center'}}>
                              {
                                alacarte &&
                                <Checkbox.Android
                                  onPress={() => updatePersoNumChecked(index, i, j)}
                                  color="#F50F50"
                                  uncheckedColor={color}
                                  status={value.checked ? "checked" : "unchecked"}
                                />
                              }
                              <Text style={styles.text}>{value.value} {alacarte && ((value.price || 0).toFixed(2)+'€')}</Text>
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
    containerStyle: { flexDirection: 'column', width:'100%', borderTopWidth: 0.5, paddingHorizontal: 0 },
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
    errorText: { fontFamily: "geometria-bold", textAlign: 'center', color:'#ff5050', fontSize: 12, width: '100%' },
    defaultFamilyBold: { fontFamily: "geometria-bold", fontSize: 18, flexWrap: 'wrap' },
    text: { fontFamily: "geometria-regular" },
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
    },
    searchIcon: {
      color: "grey",
      fontSize: 30,
      marginLeft: 5,
      marginRight: 1
    },
    menuChoiceText: {
      marginTop: 2,
      fontSize: 18,
      width: 25,
      textAlign: 'center',
      fontFamily: "geometria-regular"
    }
})