import os
import zipfile

def create_zip():
    source_dir = r"C:\Users\ASUS\.gemini\antigravity\scratch\FraudShield-AI"
    output_zip = r"C:\Users\ASUS\Desktop\FraudShield_AI_Final_Project.zip"
    
    # Exclude these large and unnecessary directories
    exclude_dirs = {'node_modules', '.next', 'venv', 'env', '__pycache__', '.git'}
    
    print(f"Creating ZIP archive at {output_zip}...")
    
    with zipfile.ZipFile(output_zip, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(source_dir):
            # Modify dirs in-place to skip excluded directories
            dirs[:] = [d for d in dirs if d not in exclude_dirs]
            
            for file in files:
                file_path = os.path.join(root, file)
                # Store the file with a relative path inside the zip
                arcname = os.path.relpath(file_path, source_dir)
                zipf.write(file_path, arcname)
                
    print("ZIP creation completed successfully!")

if __name__ == "__main__":
    create_zip()
