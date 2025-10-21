import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import tw from 'twrnc';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const SignupScreen = ({ onSignup, onNavigateToLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async () => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Please fill all fields.');
      return;
    }

    try {
      if (onSignup) {
        await onSignup({ name, email, password });
      } else {
        Alert.alert('Signup', 'Pretend signup successful (pass a real onSignup prop).');
      }
    } catch (e) {
      Alert.alert('Signup failed', e?.message || 'Unknown error');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={tw`flex-1 justify-center items-center bg-white px-6`}
    >
      <Text style={tw`text-2xl font-bold text-blue-600 mb-6`}>Create Account</Text>

      {/* Name Field */}
      <View style={tw`flex-row items-center border border-gray-300 rounded-lg px-3 py-2 mb-4 w-full`}>
        <MaterialIcons name="person" size={22} color="#555" />
        <TextInput
          style={tw`flex-1 ml-2 text-base text-gray-800`}
          placeholder="Full Name"
          value={name}
          onChangeText={setName}
        />
      </View>

      {/* Email Field */}
      <View style={tw`flex-row items-center border border-gray-300 rounded-lg px-3 py-2 mb-4 w-full`}>
        <MaterialIcons name="email" size={22} color="#555" />
        <TextInput
          style={tw`flex-1 ml-2 text-base text-gray-800`}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      {/* Password Field */}
      <View style={tw`flex-row items-center border border-gray-300 rounded-lg px-3 py-2 mb-6 w-full`}>
        <MaterialIcons name="lock" size={22} color="#555" />
        <TextInput
          style={tw`flex-1 ml-2 text-base text-gray-800`}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      {/* Signup Button */}
      <TouchableOpacity
        style={tw`bg-blue-600 rounded-lg w-full py-3`}
        onPress={handleSignup}
      >
        <Text style={tw`text-white text-center text-lg font-semibold`}>Sign Up</Text>
      </TouchableOpacity>

      {/* Navigate to Login */}
      <TouchableOpacity onPress={onNavigateToLogin} style={tw`mt-4`}>
        <Text style={tw`text-gray-600`}>
          Already have an account? <Text style={tw`text-blue-600 font-semibold`}>Log In</Text>
        </Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

export default SignupScreen;
