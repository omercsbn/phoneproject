/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import type {FC} from 'react';
import {
  View,
  TextInput,
  Button,
  Text,
  StatusBar,
  useColorScheme,
  TouchableOpacity,
  ScrollView,
  ImageSourcePropType,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {
  Provider as PaperProvider,
  Card,
  Title,
  Subheading,
  Portal,
  Modal,
} from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import FastImage from 'react-native-fast-image';
import isValidCepTelefonuNumarasi from 'cep-telefonu-dogrulama-v2';
import {Image} from 'react-native';

type ValidationResult = {
  isValid: boolean;
  countryCode: string;
  country: string;
  region: string;
  flag: ImageSourcePropType;
};

const App: FC = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [isDarkModeEnabled, setIsDarkModeEnabled] = useState(isDarkMode);

  const toggleDarkMode = () => {
    setIsDarkModeEnabled(!isDarkModeEnabled);
  };

  const renderDarkModeButton = () => {
    return (
      <TouchableOpacity
        style={{
          position: 'absolute',
          bottom: 16,
          right: 16,
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: isDarkModeEnabled ? 'white' : 'black',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={toggleDarkMode}>
        <Text style={{color: isDarkModeEnabled ? 'black' : 'white'}}>
          {isDarkModeEnabled ? 'L' : 'D'}
        </Text>
      </TouchableOpacity>
    );
  };

  const [phoneNumber, setPhoneNumber] = useState('');
  const [validationResult, setValidationResult] =
    useState<ValidationResult | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [logVisible, setLogVisible] = useState(false);
  const [logResults, setLogResults] = useState<ValidationResult[]>([]);

  const handleValidate = () => {
    const result = isValidCepTelefonuNumarasi(phoneNumber);
    setValidationResult(result);
    setModalVisible(true);
    setLogResults(prevResults => [...prevResults, result]);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  return (
    <PaperProvider>
      <StatusBar
        barStyle={isDarkModeEnabled ? 'light-content' : 'dark-content'}
        backgroundColor={Colors.primary}
      />
      <View
        style={{
          flex: 1,
          backgroundColor: isDarkModeEnabled ? Colors.black : Colors.white,
        }}>
        <ScrollView contentContainerStyle={{padding: 16}}>
          <FastImage
            style={{
              width: 150,
              height: 150,
              alignSelf: 'center',
              marginBottom: 24,
            }}
            source={require('./assets/logo.gif')}
            resizeMode={FastImage.resizeMode.contain}
          />
          <Animatable.Text
            animation="fadeIn"
            style={{
              fontSize: 24,
              fontWeight: 'bold',
              textAlign: 'center',
              color: isDarkModeEnabled ? Colors.white : Colors.black,
            }}>
            Phone Number Validator
          </Animatable.Text>
          <Card
            style={{
              marginTop: 24,
              padding: 16,
              borderRadius: 16,
              backgroundColor: isDarkModeEnabled ? '#2d2d2d' : '#f5f5f5',
              shadowColor: '#000',
              shadowOpacity: 0.2,
              shadowOffset: {width: 0, height: 2},
              shadowRadius: 4,
              elevation: 4,
            }}>
            <TextInput
              style={{
                height: 40,
                borderWidth: 1,
                borderRadius: 8,
                padding: 10,
                paddingBottom: 10,
                marginBottom: 16,
                color: isDarkModeEnabled ? Colors.white : Colors.black,
                borderColor: isDarkModeEnabled ? Colors.white : Colors.black,
                backgroundColor: isDarkModeEnabled ? '#3d3d3d' : '#f0f0f0',
              }}
              onChangeText={setPhoneNumber}
              value={phoneNumber}
              placeholder="Enter phone number"
              keyboardType="phone-pad"
              placeholderTextColor={
                isDarkModeEnabled ? Colors.white : Colors.black
              }
            />
            <Button
              onPress={handleValidate}
              title="Validate"
              color={isDarkModeEnabled ? Colors.blue : Colors.blue}
            />
          </Card>
          {validationResult && (
            <Portal>
              <Modal
                visible={modalVisible}
                onDismiss={handleCloseModal}
                contentContainerStyle={{padding: 16}}>
                <ResultBox
                  isValid={validationResult.isValid}
                  countryCode={validationResult.countryCode}
                  country={validationResult.country}
                  region={validationResult.region}
                  flag={validationResult.flag}
                  isDarkModeEnabled={isDarkModeEnabled}
                />
              </Modal>
            </Portal>
          )}
          <View style={{marginTop: 32}}>
            <Button
              title={logVisible ? 'Hide Log' : 'Show Log'}
              onPress={() => setLogVisible(!logVisible)}
              color={isDarkModeEnabled ? Colors.black : Colors.black}
            />
          </View>
          {logVisible && (
            <ScrollView
              style={{
                maxHeight: 200,
                marginTop: 16,
                borderRadius: 16,
                backgroundColor: isDarkModeEnabled ? '#2d2d2d' : '#f5f5f5',
                shadowColor: '#000',
                shadowOpacity: 0.2,
                shadowOffset: {width: 0, height: 2},
                shadowRadius: 4,
                elevation: 4,
              }}>
              {logResults.map((result, index) => (
                <ResultBox
                  key={index}
                  isValid={result.isValid}
                  flag={result.flag}
                  countryCode={result.countryCode}
                  country={result.country}
                  region={result.region}
                  isDarkModeEnabled={isDarkModeEnabled}
                />
              ))}
            </ScrollView>
          )}
        </ScrollView>
        {renderDarkModeButton()}
      </View>
    </PaperProvider>
  );
};


const ResultBox: FC<{
  isValid: boolean;
  countryCode: string;
  country: string;
  region: string;
  flag: ImageSourcePropType;
  isDarkModeEnabled: boolean;
}> = ({isValid, countryCode, country, region, flag, isDarkModeEnabled}) => {
  return (
    <Card
      style={{
        marginTop: 16,
        borderRadius: 16,
        backgroundColor: isDarkModeEnabled ? '#2d2d2d' : '#f5f5f5',
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: {width: 0, height: 2},
        shadowRadius: 4,
        elevation: 4,
      }}>
      <Card.Content>
        <View
          style={{flexDirection: 'row', alignItems: 'center', marginBottom: 8}}>
          <Title
            style={{color: isDarkModeEnabled ? Colors.white : Colors.black}}>
            Validation Result
          </Title>
        </View>
        <Image
          source={flag}
          style={{width: 50, height: 50, marginRight: 8}}
          resizeMode="contain"
        />
        <Subheading
          style={{color: isDarkModeEnabled ? Colors.white : Colors.black}}>
          Phone number is {isValid ? 'valid' : 'invalid'}.
        </Subheading>
        {isValid && (
          <View style={{marginTop: 16}}>
            <Text
              style={{color: isDarkModeEnabled ? Colors.white : Colors.black}}>
              Country code: {countryCode}
            </Text>
            <Text
              style={{color: isDarkModeEnabled ? Colors.white : Colors.black}}>
              Country: {country}
            </Text>
            <Text
              style={{color: isDarkModeEnabled ? Colors.white : Colors.black}}>
              Region: {region}
            </Text>
          </View>
        )}
      </Card.Content>
    </Card>
  );
};

export default App;
