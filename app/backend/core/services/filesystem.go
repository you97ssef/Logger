package services

import (
	"encoding/json"
	"io"
	"os"
	"path/filepath"
	"runtime"
)

func NewFilesystem() *Filesystem {
	return &Filesystem{}
}

type Filesystem struct {
}

func (f *Filesystem) DirExists(path string) bool {
	_, err := os.Stat(path)

	return err == nil
}

func (f *Filesystem) CreateDir(path string) error {
	err := os.MkdirAll(path, os.ModePerm)

	return err
}

func (f *Filesystem) FileExists(path string) bool {
	_, err := os.Stat(path)

	return err == nil
}

func (f *Filesystem) CreateEmptyFile(path string) error {
	err := os.MkdirAll(filepath.Dir(path), os.ModePerm)
	if err != nil {
		return err
	}

	file, err := os.Create(path)

	if err != nil {
		return err
	}

	defer file.Close()

	return nil
}

func (f *Filesystem) CreateFile(path string, data string) error {
	err := os.MkdirAll(filepath.Dir(path), os.ModePerm)
	if err != nil {
		return err
	}

	file, err := os.Create(path)

	if err != nil {
		return err
	}

	_, err = file.Write([]byte(data))
	if err != nil {
		return err
	}

	defer file.Close()

	return nil
}

func (f *Filesystem) CreateJSONFile(path string, data interface{}) error {
	err := os.MkdirAll(filepath.Dir(path), os.ModePerm)
	if err != nil {
		return err
	}

	file, err := os.Create(path)
	if err != nil {
		return err
	}
	defer file.Close()

	jsonData, err := json.MarshalIndent(data, "", "  ")
	if err != nil {
		return err
	}

	_, err = file.Write(jsonData)
	if err != nil {
		return err
	}

	return nil
}

func (f *Filesystem) ReadJSONFromFile(path string, target interface{}) error {
	file, err := os.Open(path)
	if err != nil {
		return err
	}
	defer file.Close()

	jsonData, err := io.ReadAll(file)
	if err != nil {
		return err
	}

	err = json.Unmarshal(jsonData, target)
	if err != nil {
		return err
	}

	return nil
}

func (f *Filesystem) ReadContentFromFile(path string) (string, error) {
	file, err := os.Open(path)
	if err != nil {
		return "", err
	}
	defer file.Close()

	content, err := io.ReadAll(file)
	if err != nil {
		return "", err
	}

	return string(content), nil
}

func (f *Filesystem) GetHiddenFolderPath() (string, error) {
	homeDir, err := os.UserHomeDir()
	if err != nil {
		return "", err
	}

	var hiddenFolderPath string
	if runtime.GOOS == "windows" {
		hiddenFolderPath = filepath.Join(homeDir, "AppData", "Local", ".logger")
	} else {
		hiddenFolderPath = filepath.Join(homeDir, ".logger")
	}

	return hiddenFolderPath, nil
}

func (f *Filesystem) CopyFile(sourcePath, destinationPath string) error {
	sourceFile, err := os.Open(sourcePath)
	if err != nil {
		return err
	}
	defer sourceFile.Close()

	destinationFile, err := os.Create(destinationPath)
	if err != nil {
		return err
	}
	defer destinationFile.Close()

	_, err = io.Copy(destinationFile, sourceFile)
	if err != nil {
		return err
	}

	return nil
}

func (f *Filesystem) ListFiles(path string) ([]string, error) {
	files, err := os.ReadDir(path)
	if err != nil {
		return nil, err
	}

	var fileNames []string
	for _, file := range files {
		fileNames = append(fileNames, file.Name())
	}

	return fileNames, nil
}

func (f *Filesystem) DeleteFile(path string) error {
	err := os.Remove(path)
	if err != nil {
		return err
	}

	return nil
}
