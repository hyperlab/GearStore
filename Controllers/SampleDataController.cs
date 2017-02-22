using System;
using System.IO;
using System.Collections.Generic;
using System.Linq;
using System.Dynamic;
using Microsoft.AspNetCore.Mvc;

using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace Test.Controllers
{
    [Route("api/[controller]")]
    public class SampleDataController : Controller
    {
        [HttpGet("[action]"), Produces("application/json")]
        public string Categories()
        {
            return System.IO.File.ReadAllText(@"./Controllers/data/categories.json");
        }

        [HttpGet("[action]")]
        public JsonResult Products(string category)
        {
            string productsJson = System.IO.File.ReadAllText(@"./Controllers/data/products.json");
            string imagesJson = System.IO.File.ReadAllText(@"./Controllers/data/images.json");

            var expConverter = new ExpandoObjectConverter();
            var products = JsonConvert.DeserializeObject<List<ExpandoObject>>(productsJson, expConverter);
            var images = JsonConvert.DeserializeObject<Dictionary<string, string[]>>(imagesJson);

            if (category != null) {
                products = products.FindAll(prd => {
                    return ((prd as dynamic).categories).Contains(category);
                });
            }

            return Json(products.Select<dynamic, dynamic>(prd => {
                string[] imgs;

                images.TryGetValue(prd.sku, out imgs);
                prd.images = imgs.Select(img => "/images/product" + img);

                return prd;
            }));
        }
    }
}
