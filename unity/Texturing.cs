using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Texturing : MonoBehaviour
{
    private WsClient client;
    private string server = "ws://localhost:9966";

    [SerializeField]
    private Renderer renderer;
    
    // Start is called before the first frame update
    async void Start()
    {
        client = new WsClient(server);
        await client.Connect();
    }

    // Update is called once per frame
    void Update()
    {
        var cqueue = client.receiveQueue;
        byte[] msg;

        while (cqueue.TryPeek(out msg))
        {
            // Debug.Log("Dequeue");
            cqueue.TryDequeue(out msg);
            if (msg != null)
            {
                // Create a 256x256 texture with RGBA24 format
                Texture2D tex = new Texture2D(256, 256, TextureFormat.RGB24, false);
                tex.LoadRawTextureData(msg);
                tex.Apply();
                // Assign texture to renderer's material.
                this.renderer.material.mainTexture = tex;
            }
        }
    }
}
