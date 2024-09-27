// ConvertToC++.cpp : This file contains the 'main' function. Program execution begins and ends there.
//


#include <cstdlib>
#include <iostream>
#include <fstream>
#include <string>
#include <sstream>

#define readbin std::ios::binary | std::ios::in
#define writebin std::ios::binary | std::ios::out


using namespace std;

int main()
{
	std::cout << "Input File :\n";
	ifstream fileInput("Input.txt", readbin);

	if (!fileInput) {
		std::cerr << "Error opening file!" << std::endl;
		cout << "creating Input.txt instead " << endl;
		system("type nul >> Input.txt");
		ifstream fileInput("Input.txt", readbin);
	}
	
	stringstream buffer;
	buffer << fileInput.rdbuf();
	string fileDump = buffer.str();
	cout << fileDump << endl;



	fileInput.close();
	return 0;
}

