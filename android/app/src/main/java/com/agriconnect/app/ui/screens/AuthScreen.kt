package com.agriconnect.app.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.agriconnect.app.viewmodel.AuthViewModel

@Composable
fun AuthScreen(viewModel: AuthViewModel) {
    val uiState by viewModel.uiState.collectAsState()
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var fullName by remember { mutableStateOf("") }
    var isRegister by remember { mutableStateOf(false) }
    var resetEmail by remember { mutableStateOf("") }

    Column(modifier = Modifier.fillMaxSize().padding(16.dp), horizontalAlignment = Alignment.CenterHorizontally) {
        Text(if (isRegister) "Register" else "Login", style = MaterialTheme.typography.headlineSmall)
        Spacer(Modifier.height(16.dp))
        if (uiState.isLoading) {
            CircularProgressIndicator()
        }
        uiState.error?.let {
            Text("Error: $it", color = MaterialTheme.colorScheme.error)
        }
        uiState.successMessage?.let {
            Text(it, color = MaterialTheme.colorScheme.primary)
        }
        if (isRegister) {
            OutlinedTextField(value = fullName, onValueChange = { fullName = it }, label = { Text("Full Name") })
        }
        OutlinedTextField(value = email, onValueChange = { email = it }, label = { Text("Email") })
        OutlinedTextField(value = password, onValueChange = { password = it }, label = { Text("Password") }, visualTransformation = PasswordVisualTransformation())
        Spacer(Modifier.height(8.dp))
        Row {
            Button(onClick = {
                if (isRegister) viewModel.register(email, password, fullName)
                else viewModel.login(email, password)
            }) {
                Text(if (isRegister) "Register" else "Login")
            }
            Spacer(Modifier.width(8.dp))
            TextButton(onClick = { isRegister = !isRegister }) {
                Text(if (isRegister) "Have an account? Login" else "No account? Register")
            }
        }
        Spacer(Modifier.height(8.dp))
        OutlinedTextField(value = resetEmail, onValueChange = { resetEmail = it }, label = { Text("Reset Email") })
        Button(onClick = { viewModel.resetPassword(resetEmail) }) {
            Text("Reset Password")
        }
        Spacer(Modifier.height(16.dp))
        Button(onClick = { viewModel.logout() }) {
            Text("Logout")
        }
    }
} 