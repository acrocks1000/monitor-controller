{
  "targets": [
    {
      "target_name": "ddc_controller",
      "sources": [ "src/native/ddc_controller.cc" ],
      "include_dirs": [
        "<!(node -p \"require('node').include_dir\")"
      ],
      "msvs_version": "2022",
      "msvs_settings": {
        "VCCLCompilerTool": {
          "AdditionalOptions": [ "/std:c++17" ]
        },
        "VCLinkerTool": {
          "AdditionalLibraryDirectories": []
        }
      },
      "libraries": [
        "dxva2.lib",
        "setupapi.lib",
        "winmm.lib",
        "user32.lib"
      ],
      "conditions": [
        [ "OS=='win'", {
          "libraries": [
            "Dxva2.lib",
            "setupapi.lib",
            "user32.lib"
          ]
        }]
      ]
    }
  ]
}
